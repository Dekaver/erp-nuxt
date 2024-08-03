import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { boolean, char, date, integer, jsonb, numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../account/schema';
import { gudang } from '../gudang/schema';
import { kontak } from '../kontak/schema';
import { sales_order } from '../sales_order/schema';
import { timestamps } from '../schema';
import { top } from '../top/schema';

export const invoice = pgTable('invoice', {
    id: serial('id').primaryKey().notNull(),
    nomor: varchar('nomor', { length: 30 }).notNull(),
    tanggal: date('tanggal', { mode: 'string' }).notNull(),
    id_kontak: integer('id_kontak')
        .notNull()
        .references(() => kontak.id),
    id_kantor: integer('id_kantor').notNull(),
    id_gudang: integer('id_gudang').references(() => gudang.id),
    id_top: integer('id_top')
        .notNull()
        .references(() => top.id),
    id_so: integer('id_so').references(() => sales_order.id),
    id_akun_biaya_lain: integer('id_akun_biaya_lain').references(() => account.id),
    kepada: varchar('kepada', { length: 100 }),
    faktur: varchar('faktur'),
    keterangan: varchar('keterangan', { length: 100 }),
    id_salesman: integer('id_salesman'),
    alamat: varchar('alamat', { length: 100 }),
    nilai_harga: char('nilai_harga', { length: 1 }),
    total_pajak: numeric('total_pajak').default('0'),
    pajak: jsonb('pajak'),
    potongan_pajak: numeric('potongan_pajak').default('0'),
    total: numeric('total').default('0'),
    total_discount: numeric('total_discount').default('0'),
    dpp: numeric('dpp').default('0'),
    grandtotal: numeric('grandtotal').default('0'),
    biaya_lain: numeric('biaya_lain').default('0'),
    diskonpersen: numeric('diskonpersen').default('0'),
    top: integer('top').notNull(),
    referensi: varchar('referensi'),
    status: char('status', { length: 1 }),
    tanggal_jatuh_tempo: date('tanggal_jatuh_tempo'),
    tanggal_bayar: date('tanggal_bayar'),
    tanggal_terima_invoice: date('tanggal_terima_invoice'),
    is_stok: boolean('is_stok').default(false),
    ttd_id: integer('ttd_id'),
    ...timestamps,
});

export const insertInvoiceSchema = createInsertSchema(invoice);
export const updateInvoiceSchema = createInsertSchema(invoice).omit({ id: true, created_at: true, created_by: true });

export type Invoice = InferSelectModel<typeof invoice>;
export type NewInvoice = z.infer<typeof insertInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;

export const InvoiceColumns = getTableColumns(invoice);
