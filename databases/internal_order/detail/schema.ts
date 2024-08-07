import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { internal_order } from '../schema';
import { satuan } from '../../barang/satuan/schema';

export const internal_order_detail = pgTable(
    'internal_order_detail',
    {
        id: integer('id_internal_order')
            .notNull()
            .references(() => internal_order.id),
        id_barang: integer('barang')
            .notNull()
            .references(() => barang.id),
        id_satuan: integer('satuan')
            .notNull()
            .references(() => satuan.id),
        urut: integer('urut').notNull(),
        qty: numeric('qty').notNull().default('0'),
        diambil: numeric('diambil').notNull().default('0'),
        sisa: numeric('sisa').notNull().default('0'),
        keterangan: varchar('keterangan'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.id_barang] }),
        };
    }
);

export const insertInternalOrderDetailSchema = createInsertSchema(internal_order_detail);

export type InternalOrderDetail = InferSelectModel<typeof internal_order_detail>;
export type NewInternalOrderDetail = z.infer<typeof insertInternalOrderDetailSchema>;

export const InternalOrderDetailColumns = getTableColumns(internal_order_detail);
