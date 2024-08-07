import { varchar, serial, numeric, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';
import { timestamps } from '../../schema';

export const ptkp = pgTable('ptkp', {
    id: serial('id').primaryKey().notNull(),
    ptkp: varchar('ptkp', { length: 30 }).notNull(),
    nominal: numeric('nominal').default('0'),
    ...timestamps,
});

export const insertPtkpSchema = createInsertSchema(ptkp);

export type Ptkp = InferSelectModel<typeof ptkp>;
export type NewPtkp = z.infer<typeof insertPtkpSchema>;

export const ptkpColumns = getTableColumns(ptkp);
