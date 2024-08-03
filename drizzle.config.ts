import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './server/api/**/schema.ts',
    out: './server/databases/migrations',
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },
});
