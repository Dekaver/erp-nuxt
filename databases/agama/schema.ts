import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const agama = pgTable('agama', {
    id: serial('id').primaryKey().notNull(),
    agama: varchar('agama', { length: 25 }).notNull(),
    ...timestamps,
});

export const insertAgamaSchema = createInsertSchema(agama);
export const updateAgamaSchema = createInsertSchema(agama).omit({ id: true, created_by: true, created_at: true });

export type Agama = InferSelectModel<typeof agama>;
export type NewAgama = z.infer<typeof insertAgamaSchema>;
export type UpdateAgama = z.infer<typeof updateAgamaSchema>;

export const AgamaColumns = getTableColumns(agama);
