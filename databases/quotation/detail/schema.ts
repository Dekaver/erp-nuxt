import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { quotation } from '../schema';
import { satuan } from '../../barang/satuan/schema';

export const quotation_detail = pgTable(
    'quotation_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => quotation.id),
        urut: integer('urut').notNull(),
        id_barang: integer('id_barang').references(() => barang.id),
        nama_barang: varchar('nama_barang').notNull(),
        qty: numeric('qty').notNull(),
        id_satuan: integer('id_satuan').references(() => satuan.id),
        harga: numeric('harga').notNull(),
        diskonrp: numeric('diskonrp'),
        diskonpersen: numeric('diskonpersen'),
        total: numeric('total').notNull(),
        note: varchar('note'),
        id_pajak: varchar('id_pajak'),
        persen_pajak: varchar('persen_pajak'),
    },
    (table) => {
        return {
            penawaranDetailPkey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);

export const insertQuotationDetailSchema = createInsertSchema(quotation_detail);

export type QuotationDetail = InferSelectModel<typeof quotation_detail>;
export type NewQuotationDetail = z.infer<typeof insertQuotationDetailSchema>;

export const QuotationDetailColumns = getTableColumns(quotation_detail);
