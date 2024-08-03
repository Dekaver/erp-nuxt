import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, char, date, integer, numeric, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../account/schema';
import { kontak } from '../kontak/schema';
import { purchase_order } from '../purchase_order/schema';
import { timestamps } from '../schema';

export const uang_muka = pgTable('uang_muka', {
    id: serial('id').primaryKey(),
    nomor: varchar('nomor', { length: 30 }).notNull(),
    tanggal: date('tanggal', { mode: 'string' }).defaultNow().notNull(),
    id_supplier: integer('id_supplier')
        .notNull()
        .references(() => kontak.id),
    id_po: integer('id_po')
        .notNull()
        .references(() => purchase_order.id),
    id_account: integer('id_account')
        .notNull()
        .references(() => account.id),
    jenis_pembayaran: char('jenis_pembayaran', { length: 1 }).notNull(),
    pembayaran: varchar('pembayaran'),
    keterangan: text('keterangan'),
    total_po: numeric('total_po').default('0').notNull(),
    sisa_tagihan: numeric('sisa_tagihan').default('0'),
    bayar: numeric('bayar').default('0').notNull(),
    is_pajak: boolean('is_pajak'),
    pajak: numeric('pajak').default('0').notNull(),
    grandtotal: numeric('grandtotal').default('0').notNull(),
    status: char('status', { length: 1 }).notNull(),
    ...timestamps,
});

export const insertUangMukaSchema = createInsertSchema(uang_muka);
export const updateUangMukaSchema = createInsertSchema(uang_muka).omit({ id: true, created_by: true, updated_by: true });

export type UangMuka = InferSelectModel<typeof uang_muka>;
export type NewUangMuka = z.infer<typeof insertUangMukaSchema>;
export type UpdateUangMuka = z.infer<typeof updateUangMukaSchema>;

export const UangMukaColumns = getTableColumns(uang_muka);
