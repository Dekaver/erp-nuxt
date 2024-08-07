import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { char, date, jsonb, numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { timestamps } from '../schema';

export const purchase_request = pgTable('purchase_request', {
    id: serial('id').notNull().primaryKey(),
    nomor: varchar('nomor').notNull(),
    tanggal: date('tanggal').notNull(),
    keterangan: varchar('keterangan'),
    status: char('status', { length: 1 }).notNull(), // D: DRAFT, S: SEND, O: OPEN
    dpp: numeric('dpp').notNull(),
    total: numeric('total').default('0').notNull(),
    total_discount: numeric('total_discount').default('0').notNull(),
    persendiskon: numeric('persendiskon').notNull(),
    pajak: jsonb('pajak'),
    grandtotal: numeric('grandtotal').notNull(),
    tgl_dibutuhkan: date('tgl_dibutuhkan'),
    ...timestamps,
});

export const insertPurchaseRequestSchema = createInsertSchema(purchase_request);
export const updatePurchaseRequestSchema = createInsertSchema(purchase_request).omit({ id: true, created_by: true, created_at: true });

export type PurchaseRequest = InferSelectModel<typeof purchase_request>;
export type NewPurchaseRequest = z.infer<typeof insertPurchaseRequestSchema>;
export type UpdatePurchaseRequest = z.infer<typeof updatePurchaseRequestSchema>;

export const PurchaseRequestColumns = getTableColumns(purchase_request);
