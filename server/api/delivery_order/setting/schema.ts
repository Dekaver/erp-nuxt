import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../../schema';

export const delivery_order_setting = pgTable('delivery_order_setting', {
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

export const insertDeliveryOrderSettingSchema = createInsertSchema(delivery_order_setting);
export const updateDeliveryOrderSettingSchema = createInsertSchema(delivery_order_setting).omit({ id: true, created_by: true, created_at: true });

export type DeliveryOrderSetting = InferSelectModel<typeof delivery_order_setting>;
export type NewDeliveryOrderSetting = z.infer<typeof insertDeliveryOrderSettingSchema>;
export type UpdateDeliveryOrderSetting = z.infer<typeof updateDeliveryOrderSettingSchema>;

export const DeliveryOrderSettingCOlumns = getTableColumns(delivery_order_setting);
