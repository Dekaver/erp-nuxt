import { type InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const top = pgTable('top', {
    id: serial('id').primaryKey().notNull(),
    top: integer('top'),
    keterangan: varchar('keterangan'),
    ...timestamps,
});

export const insertTopSchema = createInsertSchema(top);
export const updateTopSchema = createInsertSchema(top).omit({ id: true, created_by: true, created_at: true });

export type Top = InferSelectModel<typeof top>;
export type NewTop = z.infer<typeof insertTopSchema>;
export type UpdateTop = z.infer<typeof updateTopSchema>;

export const TopColumns = getTableColumns(top);
