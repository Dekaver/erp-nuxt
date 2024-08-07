import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const departemen = pgTable('departemen', {
    id: serial('id').primaryKey().notNull(),
    departemen: varchar('departemen').notNull(),
    kode: varchar('kode').notNull(),
    ...timestamps,
});

export const insertDepartemenSchema = createInsertSchema(departemen);
export const updateDepartemenSchema = createInsertSchema(departemen).omit({ id: true, created_by: true, created_at: true });

export type Departemen = InferSelectModel<typeof departemen>;
export type NewDepartemen = z.infer<typeof insertDepartemenSchema>;
export type UpdateDepartemen = z.infer<typeof updateDepartemenSchema>;

export const DepartemenColumns = getTableColumns(departemen);
