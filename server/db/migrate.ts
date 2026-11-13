import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, getPool } from "./client.js";

await migrate(db(), { migrationsFolder: new URL("../../drizzle", import.meta.url).pathname });
await getPool().end();
console.log("Migrasi selesai.");
