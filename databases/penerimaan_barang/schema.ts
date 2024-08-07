import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { char, date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { gudang } from '../gudang/schema';
import { kontak } from '../kontak/schema';
import { purchase_order } from '../purchase_order/schema';
import { timestamps } from '../schema';

export const penerimaan_barang = pgTable('penerimaan_barang', {
    id: serial('id').primaryKey(),
    id_po: integer('id_po')
        .notNull()
        .references(() => purchase_order.id),
    nomor: varchar('nomor', { length: 30 }).notNull(),
    tanggal: date('tanggal').defaultNow().notNull(),
    id_supplier: integer('id_supplier')
        .references(() => kontak.id)
        .notNull(),
    id_gudang: integer('id_gudang')
        .references(() => gudang.id)
        .notNull(),
    referensi: varchar('referensi', { length: 30 }).notNull(),
    tanggal_referensi: date('tanggal_referensi', { mode: 'string' }).defaultNow().notNull(),
    keterangan: varchar('keterangan', { length: 100 }),
    alamat: varchar('alamat', { length: 100 }),
    status: char('status', { length: 1 }).notNull(), // D: DRAFT, S: SEND, C: CLOSED
    ...timestamps,
});

export const insertPenerimaanBarangSchema = createInsertSchema(penerimaan_barang);
export const updatePenerimaanBarangSchema = createInsertSchema(penerimaan_barang).omit({ id: true, created_by: true, updated_by: true });

export type PenerimaanBarang = InferSelectModel<typeof penerimaan_barang>;
export type NewPenerimaanBarang = z.infer<typeof insertPenerimaanBarangSchema>;
export type UpdatePenerimaanBarang = z.infer<typeof updatePenerimaanBarangSchema>;

export const PenerimaanBarangColumns = getTableColumns(penerimaan_barang);
