import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const proyek = pgTable('proyek', {
    id: serial('id').primaryKey().notNull(),
    kode: varchar('kode', { length: 25 }).notNull().unique(),
    proyek: varchar('proyek', { length: 100 }).notNull(),
    lokasi: varchar('lokasi').notNull(),
    ...timestamps,
});

export const insertProyekSchema = createInsertSchema(proyek);
export const updateProyekSchema = createInsertSchema(proyek).omit({ id: true, created_by: true, created_at: true });

export type Proyek = InferSelectModel<typeof proyek>;
export type NewProyek = z.infer<typeof insertProyekSchema>;
export type UpdateProyek = z.infer<typeof updateProyekSchema>;

export const ProyekColumns = getTableColumns(proyek);
