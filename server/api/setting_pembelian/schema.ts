import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, char, integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const settingPembelian = pgTable('setting_pembelian', {
    id: serial('id').primaryKey().notNull(),
    diskon_per_baris: boolean('diskon_per_baris').notNull(),
    diskon_total: boolean('diskon_total').notNull(),
    pajak: char('pajak', { length: 1 }),
    id_pajak: integer('id_pajak').array(),
    proyek: boolean('proyek').notNull(),
    ...timestamps,
});

export const insertSettingPembelianSchema = createInsertSchema(settingPembelian);
export const updateSettingPembelianSchema = createInsertSchema(settingPembelian).omit({ id: true, created_by: true, created_at: true });

export type SettingPembelian = InferSelectModel<typeof settingPembelian>;
export type NewSettingPembelian = z.infer<typeof insertSettingPembelianSchema>;
export type UpdateSettingPembelian = z.infer<typeof updateSettingPembelianSchema>;

export const SettingPembelianColumns = getTableColumns(settingPembelian);
