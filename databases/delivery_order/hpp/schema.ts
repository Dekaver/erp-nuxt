import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { delivery_order } from '../schema';

export const delivery_order_hpp = pgTable(
    'delivery_order_hpp',
    {
        id: integer('id')
            .notNull()
            .references(() => delivery_order.id),
        id_stok_barang: integer('id_stok_barang').notNull(),
        qty: numeric('qty').default('0').notNull(),
    },
    (table) => {
        return {
            pimaryKey: primaryKey({ columns: [table.id, table.id_stok_barang] }),
        };
    }
);

export const insertDeliveryOrderHppSchema = createInsertSchema(delivery_order_hpp);

export type DeliveryOrderHpp = InferSelectModel<typeof delivery_order_hpp>;
export type NewDeliveryOrderHpp = z.infer<typeof insertDeliveryOrderHppSchema>;

export const deliveryOrderHppColumns = getTableColumns(delivery_order_hpp);
