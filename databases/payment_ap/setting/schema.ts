import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../../schema';

export const payment_ap_setting = pgTable('payment_ap_setting', {
    id: serial('id').primaryKey().notNull(),
    persetujuan1: varchar('persetujuan1', { length: 1 }),
    persetujuan2: varchar('persetujuan2', { length: 1 }),
    persetujuan3: varchar('persetujuan3', { length: 1 }),
    persetujuan4: varchar('persetujuan4', { length: 1 }),
    jabatan_persetujuan1: integer('jabatan_persetujuan1'),
    jabatan_persetujuan2: integer('jabatan_persetujuan2'),
    jabatan_persetujuan3: integer('jabatan_persetujuan3'),
    jabatan_persetujuan4: integer('jabatan_persetujuan4'),
    ...timestamps,
});

export const insertPaymentApSettingSchema = createInsertSchema(payment_ap_setting);
export const updatePaymentApSettingSchema = createInsertSchema(payment_ap_setting).omit({ id: true, created_by: true, created_at: true });

export type PaymentApSetting = InferSelectModel<typeof payment_ap_setting>;
export type NewPaymentApSetting = z.infer<typeof insertPaymentApSettingSchema>;
export type UpdatePaymentApSetting = z.infer<typeof updatePaymentApSettingSchema>;

export const PaymentApSettingColumns = getTableColumns(payment_ap_setting);
