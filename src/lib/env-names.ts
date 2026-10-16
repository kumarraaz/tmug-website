/** Names (never values) of environment variables that look database-related. Used on admin-only setup screens. */
export function databaseEnvNames(): string[] {
  return Object.keys(process.env).filter((k) => /DATABASE|POSTGRES|NEON|PG(HOST|URL)|STORAGE/i.test(k)).sort();
}
