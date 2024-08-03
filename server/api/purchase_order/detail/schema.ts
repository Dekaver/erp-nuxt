import { foreignKey, integer, numeric, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';
import { purchase_order } from '../schema';
import { barang } from '../../barang/schema';
import { proyek } from '../../proyek/schema';
import { createInsertSchema } from 'drizzle-zod';
import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';
import { purchase_request_detail } from '../../purchase_request/detail/schema';

export const purchase_order_detail = pgTable(
    'purchase_order_detail',
    {
        id: integer('id').notNull(),
        urut: integer('urut').notNull(),
        id_barang: integer('id_barang').references(() => barang.id),
        nama_barang: varchar('nama_barang').notNull(),
        qty: numeric('qty').notNull(),
        diambil: numeric('diambil').notNull(),
        sisa: numeric('sisa').notNull(),
        invoice: numeric('invoice').notNull(),
        harga: numeric('harga').notNull(),
        total: numeric('total').notNull(),
        id_satuan: integer('id_satuan').notNull(),
        id_pajak: varchar('id_pajak'),
        persen_pajak: varchar('persen_pajak'),
        diskonpersen: numeric('diskonpersen'),
        diskonrp: numeric('diskonrp'),
        id_pr: integer('id_pr'),
        urut_pr: integer('urut_pr'),
        id_proyek: integer('id_proyek').references(() => proyek.id),
        keterangan: text('keterangan'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
            fk0: foreignKey({ columns: [table.id], foreignColumns: [purchase_order.id] }),
            fk1: foreignKey({
                columns: [table.id_pr, table.urut_pr],
                foreignColumns: [purchase_request_detail.id, purchase_request_detail.urut],
            }),
        };
    }
);

export const insertPurchaseOrderDetailSchema = createInsertSchema(purchase_order_detail);

export type PurchaseOrderDetail = InferSelectModel<typeof purchase_order_detail>;
export type NewPurchaseOrderDetail = z.infer<typeof insertPurchaseOrderDetailSchema>;

export type ExtendedPurchaseOrderDetail = PurchaseOrderDetail & {
    nama_barang: string;
    kode_barang: string;
    satuan: string;
    konversi: number;
};

export const PurchaseOrderDetailColumns = getTableColumns(purchase_order_detail);
