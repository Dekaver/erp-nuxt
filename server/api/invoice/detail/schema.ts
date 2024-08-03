import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../../account/schema';
import { delivery_order } from '../../delivery_order/schema';
import { proyek } from '../../proyek/schema';
import { invoice } from '../schema';
import { satuan } from '../../barang/satuan/schema';

export const invoice_detail = pgTable(
    'invoice_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => invoice.id),
        urut: integer('urut').notNull(),
        nama_barang: varchar('nama_barang').notNull(),
        id_barang: integer('id_barang'),
        id_satuan: integer('id_satuan')
            .notNull()
            .references(() => satuan.id),
        qty: numeric('qty').default('0').notNull(),
        harga: numeric('harga').default('0').notNull(),
        total: numeric('total').default('0').notNull(),
        harga_asli: numeric('harga_asli').default('0'),
        diskonrp: numeric('diskonrp').default('0').notNull(),
        diskonpersen: numeric('diskonpersen').default('0').notNull(),
        id_pajak: varchar('id_pajak'),
        persen_pajak: varchar('persen_pajak'),
        id_do: integer('id_do').references(() => delivery_order.id),
        keterangan: text('keterangan'),
        id_proyek: integer('id_proyek').references(() => proyek.id),
        id_account: integer('id_account').references(() => account.id),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);

export const insertInvoiceDetailSchema = createInsertSchema(invoice_detail);

export type InvoiceDetail = InferSelectModel<typeof invoice_detail>;
export type NewInvoiceDetail = z.infer<typeof insertInvoiceDetailSchema>;

export const InvoiceDetailColumns = getTableColumns(invoice_detail);
