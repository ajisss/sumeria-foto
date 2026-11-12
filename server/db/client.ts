import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../env.js";
import * as schema from "./schema.js";

let pool: pg.Pool | null = null;

export function getPool() {
  if (!pool) {
    const url = env().DATABASE_URL;
    const local = /localhost|127\.0\.0\.1/.test(url);
    pool = new pg.Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 10_000,
      ssl: local ? false : { rejectUnauthorized: true },
    });
  }
  return pool;
}

let _db: ReturnType<typeof make> | null = null;
function make() {
  return drizzle(getPool(), { schema });
}
export function db() {
  return (_db ??= make());
}
export { schema };
