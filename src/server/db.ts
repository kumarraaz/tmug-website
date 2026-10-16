import "server-only";
import { Pool, types, type PoolClient, type QueryResultRow } from "pg";
import { MIGRATIONS } from "./migrations";

/**
 * PostgreSQL access for the store (products, orders, payments, settings).
 *
 * Configured with ONE environment variable: DATABASE_URL (POSTGRES_URL is
 * accepted as an alias, which is what Vercel's Neon / Postgres integrations
 * inject). Works with Neon, Supabase, Vercel Postgres or any PostgreSQL ≥ 13.
 *
 * Without a URL nothing here can run — callers check `isDatabaseConfigured()`
 * and show an honest "not configured" state instead of fake data.
 */

// BIGINT (COUNT, SUM) → number. Safe: our totals are far below 2^53 paise.
types.setTypeParser(20, (v) => Number(v));
// DATE → "YYYY-MM-DD" string (the default would build a local-timezone Date).
types.setTypeParser(1082, (v) => v);

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Database is not configured. Set the DATABASE_URL environment variable.");
    this.name = "DatabaseNotConfiguredError";
  }
}

/**
 * The connection string. DATABASE_URL / POSTGRES_URL first; otherwise ANY variable whose value is a
 * postgres:// URL (Vercel's Neon / Postgres integrations may add a custom prefix such as STORAGE_).
 * Pooled URLs are preferred over "unpooled" / "non-pooling" ones.
 */
export function getDatabaseUrl(): string | null {
  const direct = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (direct) return direct;
  const candidates = Object.entries(process.env)
    .filter(([, v]) => typeof v === "string" && /^postgres(ql)?:\/\//i.test(v.trim()))
    .sort(([a], [b]) => Number(/UNPOOLED|NON_POOLING|NO_SSL/i.test(a)) - Number(/UNPOOLED|NON_POOLING|NO_SSL/i.test(b)) || a.localeCompare(b));
  return candidates[0]?.[1]?.trim() ?? null;
}

export const isDatabaseConfigured = (): boolean => getDatabaseUrl() !== null;

const globalForPool = globalThis as unknown as { __tmugPool?: Pool; __tmugSchema?: Promise<void> | null };

function pool(): Pool {
  const url = getDatabaseUrl();
  if (!url) throw new DatabaseNotConfiguredError();
  if (!globalForPool.__tmugPool) {
    const p = new Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      allowExitOnIdle: true,
    });
    p.on("error", (err) => console.error("[db] idle client error:", err.message));
    globalForPool.__tmugPool = p;
  }
  return globalForPool.__tmugPool;
}

/** Postgres advisory-lock key used so concurrent cold starts never migrate at the same time. */
const MIGRATION_LOCK_KEY = 7_460_001;

async function appliedMigrationIds(client: Pool | PoolClient): Promise<Set<string> | null> {
  const reg = await client.query<{ exists: string | null }>("SELECT to_regclass('public.schema_migrations') AS exists");
  if (!reg.rows[0]?.exists) return null;
  const { rows } = await client.query<{ id: string }>("SELECT id FROM schema_migrations");
  return new Set(rows.map((r) => r.id));
}

async function applyMigrations(): Promise<void> {
  // Fast path (one round trip): everything already applied.
  const done = await appliedMigrationIds(pool());
  if (done && MIGRATIONS.every((m) => done.has(m.id))) return;

  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    // Transaction-scoped lock: also safe behind pgbouncer in transaction-pooling mode.
    await client.query("SELECT pg_advisory_xact_lock($1)", [MIGRATION_LOCK_KEY]);
    await client.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
    );
    const applied = (await appliedMigrationIds(client)) ?? new Set<string>();
    for (const migration of MIGRATIONS) {
      if (applied.has(migration.id)) continue;
      await migration.run(client);
      await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [migration.id]);
      console.log(`[db] applied migration ${migration.id}`);
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Create / upgrade the schema (and seed the initial catalog once). Idempotent;
 * memoised per server instance. A failure is not cached, so the next call retries.
 */
export function ensureSchema(): Promise<void> {
  if (!globalForPool.__tmugSchema) {
    globalForPool.__tmugSchema = applyMigrations().catch((err) => {
      globalForPool.__tmugSchema = null;
      throw err;
    });
  }
  return globalForPool.__tmugSchema;
}

export interface Queryable {
  query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<T[]>;
  queryOne<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<T | null>;
}

function wrap(runner: Pool | PoolClient): Queryable {
  async function run<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
    return (await runner.query<T>(text, params)).rows;
  }
  async function runOne<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T | null> {
    return (await run<T>(text, params))[0] ?? null;
  }
  return { query: run, queryOne: runOne };
}

/** Run a query, making sure the schema exists first. */
export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  return wrap(pool()).query<T>(text, params);
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T | null> {
  return (await query<T>(text, params))[0] ?? null;
}

/**
 * Query WITHOUT creating the schema first. Used by the public storefront
 * catalog reader, which must never run DDL on a visitor's request and which
 * tolerates a missing schema (it falls back to the built-in catalog).
 */
export async function queryExisting<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  return wrap(pool()).query<T>(text, params);
}

/** Run `fn` inside a transaction (BEGIN … COMMIT, ROLLBACK on error). */
export async function tx<T>(fn: (db: Queryable) => Promise<T>): Promise<T> {
  await ensureSchema();
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(wrap(client));
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

/** Postgres error code helper (e.g. "23505" unique_violation, "42P01" undefined_table). */
export function pgErrorCode(err: unknown): string | undefined {
  return typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : undefined;
}

export function pgConstraint(err: unknown): string | undefined {
  return typeof err === "object" && err !== null && "constraint" in err ? String((err as { constraint: unknown }).constraint) : undefined;
}

export interface DatabaseStatus {
  configured: boolean;
  connected: boolean;
  host?: string;
  error?: string;
}

/** Safe-to-display health information (never includes credentials). */
export async function databaseStatus(): Promise<DatabaseStatus> {
  const url = getDatabaseUrl();
  if (!url) return { configured: false, connected: false };
  let host: string | undefined;
  try {
    host = new URL(url).hostname;
  } catch {
    host = undefined;
  }
  try {
    await ensureSchema();
    await pool().query("SELECT 1");
    return { configured: true, connected: true, host };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      configured: true,
      connected: false,
      host,
      error: message.replace(/postgres(ql)?:\/\/\S+/gi, "postgres://…").slice(0, 300),
    };
  }
}

/** Close the pool (scripts and tests only). */
export async function closePool(): Promise<void> {
  const p = globalForPool.__tmugPool;
  globalForPool.__tmugPool = undefined;
  globalForPool.__tmugSchema = null;
  if (p) await p.end();
}
