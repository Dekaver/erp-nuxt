import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import config from '../../libs/config';

const client = new pg.Client({
    connectionString: config.DATABASE_URL,
});

client.connect();

// logger
// const logger = ;

const db = drizzle(client, {logger: true});

export default db;
