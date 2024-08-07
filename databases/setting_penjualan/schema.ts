import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, char, integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const settingPenjualan = pgTable('setting_penjualan', {
    id: serial('id').primaryKey().notNull(),
    diskon_per_baris: boolean('diskon_per_baris').notNull(),
    diskon_total: boolean('diskon_total').notNull(),
    pajak: char('pajak', { length: 1 }),
    id_pajak: integer('id_pajak').array(),
    proyek: boolean('proyek').notNull(),
    ...timestamps,
});

export const insertSettingPenjualanSchema = createInsertSchema(settingPenjualan);
export const updateSettingPenjualanSchema = createInsertSchema(settingPenjualan).omit({ id: true, created_by: true, created_at: true });

export type SettingPenjualan = InferSelectModel<typeof settingPenjualan>;
export type NewSettingPenjualan = z.infer<typeof insertSettingPenjualanSchema>;
export type UpdateSettingPenjualan = z.infer<typeof updateSettingPenjualanSchema>;

export const SettingPenjualanColumns = getTableColumns(settingPenjualan);
