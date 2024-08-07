import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { delivery_order } from '../schema';
import { satuan } from '../../barang/satuan/schema';

export const delivery_order_detail = pgTable(
    'delivery_order_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => delivery_order.id),
        urut: integer('urut').notNull(),
        nama_barang: varchar('nama_barang').notNull(),
        id_barang: integer('id_barang').references(() => barang.id),
        id_satuan: integer('id_satuan')
            .notNull()
            .references(() => satuan.id),
        qty: numeric('qty').default('0').notNull(),
        qty_diterima: numeric('qty_diterima').default('0').notNull(),
        keterangan: varchar('keterangan', { length: 100 }),
        catatan: varchar('catatan'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);

export const insertDeliveryOrderDetailSchema = createInsertSchema(delivery_order_detail);

export type DeliveryOrderDetail = InferSelectModel<typeof delivery_order_detail>;
export type NewDeliveryOrderDetail = z.infer<typeof insertDeliveryOrderDetailSchema>;

export const DeliveryOrderDetailColumns = getTableColumns(delivery_order_detail);
