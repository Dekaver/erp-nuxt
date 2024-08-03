import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { char, integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../../schema';

export const purchase_request_setting = pgTable('purchase_request_setting', {
    id: serial('id').primaryKey().notNull(),
    persetujuan1: char('persetujuan1', { length: 1 }),
    persetujuan2: char('persetujuan2', { length: 1 }),
    persetujuan3: char('persetujuan3', { length: 1 }),
    persetujuan4: char('persetujuan4', { length: 1 }),
    jabatan_persetujuan1: integer('jabatan_persetujuan1'),
    jabatan_persetujuan2: integer('jabatan_persetujuan2'),
    jabatan_persetujuan3: integer('jabatan_persetujuan3'),
    jabatan_persetujuan4: integer('jabatan_persetujuan4'),
    ...timestamps,
});

export const insertPurchaseRequestSettingSchema = createInsertSchema(purchase_request_setting);
export const updatePurchaseRequestSettingSchema = createInsertSchema(purchase_request_setting).omit({ id: true, created_by: true, created_at: true });

export type PurchaseRequestSetting = InferSelectModel<typeof purchase_request_setting>;
export type NewPurchaseRequestSetting = z.infer<typeof insertPurchaseRequestSettingSchema>;
export type UpdatePurchaseRequestSetting = z.infer<typeof updatePurchaseRequestSettingSchema>;

export const PurchaseRequestSettingColumns = getTableColumns(purchase_request_setting);
