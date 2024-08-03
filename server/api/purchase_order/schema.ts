import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { char, date, integer, jsonb, numeric, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { gudang } from '../gudang/schema';
import { kontak } from '../kontak/schema';
import { timestamps } from '../schema';
import { top } from '../top/schema';

export const purchase_order = pgTable('purchase_order', {
    id: serial('id').primaryKey(),

    id_gudang: integer('id_gudang').references(() => gudang.id),
    id_supplier: integer('id_supplier')
        .notNull()
        .references(() => kontak.id),
    id_top: integer('id_top')
        .notNull()
        .references(() => top.id),

    nomor: varchar('nomor').notNull().unique(),
    tanggal: date('tanggal').notNull(),
    keterangan: text('keterangan'),

    telepon: varchar('telepon'),
    email: varchar('email'),
    top: integer('top').notNull(),
    syarat: text('syarat'),

    alamat_kirim: text('alamat_kirim'),
    referensi: varchar('referensi', { length: 100 }),
    tanggal_referensi: date('tanggal_referensi'),

    total: numeric('total').default('0').notNull(),
    dpp: numeric('dpp').notNull(),
    persendiskon: numeric('persendiskon').notNull(),
    total_discount: numeric('total_discount').default('0').notNull(),
    pajak: jsonb('pajak'),
    grandtotal: numeric('grandtotal').notNull(),
    status: char('status', { length: 1 }).notNull(), // D: DRAFT, S: SEND, O: OPEN, P: PARTIAL, C: CLOSED
    ...timestamps,
});

export const insertPurchaseOrderSchema = createInsertSchema(purchase_order);
export const updatePurchaseOrderSchema = createInsertSchema(purchase_order).omit({ id: true, created_by: true, created_at: true });

export type PurchaseOrder = InferSelectModel<typeof purchase_order>;
export type NewPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type UpdatePurchaseOrder = z.infer<typeof updatePurchaseOrderSchema>;

export const PurchaseOrderColumns = getTableColumns(purchase_order);
