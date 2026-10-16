/**
 * Apply database migrations (and the one-time catalogue seed) manually.
 *
 *   DATABASE_URL=postgres://… npm run db:migrate
 *
 * This is optional: the app runs the same idempotent migrations automatically
 * the first time the admin panel or checkout touches the database.
 */
import { closePool, databaseStatus, getDatabaseUrl } from "../src/server/db";

async function main() {
  if (!getDatabaseUrl()) {
    console.error("DATABASE_URL is not set — nothing to migrate.");
    process.exit(1);
  }
  const status = await databaseStatus();
  if (!status.connected) {
    console.error(`Database connection failed: ${status.error ?? "unknown error"}`);
    process.exit(1);
  }
  console.log(`Database ready (host: ${status.host ?? "unknown"}). Migrations are up to date.`);
  await closePool();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
