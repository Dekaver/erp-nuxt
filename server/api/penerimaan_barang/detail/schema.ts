import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { foreignKey, integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { purchase_order_detail } from '../../purchase_order/detail/schema';
import { penerimaan_barang } from '../schema';
import { satuan } from '../../barang/satuan/schema';

export const penerimaan_barang_detail = pgTable(
    'penerimaan_barang_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => penerimaan_barang.id),
        urut: integer('urut').notNull(),
        id_po: integer('id_po').notNull(),
        urut_po: integer('urut_po').notNull(),
        id_barang: integer('id_barang').references(() => barang.id),
        nama_barang: varchar('nama_barang').notNull(),
        note: varchar('note', { length: 200 }),
        diambil: numeric('diambil').default('0').notNull(),
        diorder: numeric('diorder').default('0').notNull(),
        sisa: numeric('sisa').default('0').notNull(),
        batch: varchar('batch', { length: 400 }),
        id_satuan: integer('id_satuan')
            .notNull()
            .references(() => satuan.id),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
            foreignKey: foreignKey({
                columns: [table.id_po, table.urut_po],
                foreignColumns: [purchase_order_detail.id, purchase_order_detail.urut],
            }),
        };
    }
);
export const insertPenerimaanBarangDetailSchema = createInsertSchema(penerimaan_barang_detail);

export type PenerimaanBarangDetail = InferSelectModel<typeof penerimaan_barang_detail>;
export type NewPenerimaanBarangDetail = z.infer<typeof insertPenerimaanBarangDetailSchema>;

export const PenerimaanBarangDetailColumns = getTableColumns(penerimaan_barang_detail);
