import type { Config } from "drizzle-kit";
import config from "./libs/config";
export default {
    // schema: "./src/schemas/**/*.{ts,js}",
    schema: "./server/modules/**/schema.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString: config.DATABASE_URL,
    },
    schemaFilter: ["public", "hr", "statis"],
} satisfies Config;
