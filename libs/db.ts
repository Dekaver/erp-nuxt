import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import config from "./config";
import moment from "moment-timezone";
import type { Logger } from "drizzle-orm";


class MyLogger implements Logger {
    logQuery(query: string, params: unknown[]): void {
        const timestamp = moment().tz("Asia/Makassar").format("YYYY-MM-DD HH:mm:ss");
        console.log(`\n[${timestamp}]`, "Query: ", query, params);
    }
}
const client = postgres(config.DATABASE_URL, { max: 1 });
const db = drizzle(client, { logger: new MyLogger });
// const db = drizzle(client);

// migrate(db, { migrationsFolder: "drizzle" });

export default db;
