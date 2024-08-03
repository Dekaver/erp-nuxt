import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const jenis_kendaraan = pgTable('jenis_kendaraan', {
    id: serial('id').primaryKey().notNull(),
    kode_kendaraan: varchar('kode_kendaraan', { length: 4 }).notNull(),
    jenis_kendaraan: varchar('jenis_kendaraan', { length: 20 }).notNull(),
    ...timestamps,
});

export const insertJenisKendaraanSchema = createInsertSchema(jenis_kendaraan);
export const updateJenisKendaraanSchema = createInsertSchema(jenis_kendaraan).omit({ id: true, created_by: true, created_at: true });

export type JenisKendaraan = InferSelectModel<typeof jenis_kendaraan>;
export type NewJenisKendaraan = z.infer<typeof insertJenisKendaraanSchema>;
export type UpdateJenisKendaraan = z.infer<typeof updateJenisKendaraanSchema>;

export const JenisKendaraanColumns = getTableColumns(jenis_kendaraan);
