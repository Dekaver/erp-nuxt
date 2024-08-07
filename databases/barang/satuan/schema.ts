import { type InferSelectModel, getTableColumns } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../../schema';

export const satuan = pgTable('satuan', {
    id: serial('id').primaryKey().notNull(),
    satuan: varchar('satuan', { length: 20 }).notNull(),
    keterangan: varchar('keterangan'),
    ...timestamps,
});

export const insertSatuanSchema = createInsertSchema(satuan);
export const updateSatuanSchema = createInsertSchema(satuan).omit({ id: true, created_by: true, created_at: true });

export type Satuan = InferSelectModel<typeof satuan>;
export type NewSatuan = z.infer<typeof insertSatuanSchema>;
export type UpdateSatuan = z.infer<typeof updateSatuanSchema>;

export const SatuanColumns = getTableColumns(satuan);
