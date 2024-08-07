import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { purchase_request } from '../schema';

export const purchase_request_persetujuan = pgTable(
    'purchase_request_persetujuan',
    {
        id: integer('id')
            .notNull()
            .references(() => purchase_request.id),
        id_pegawai: integer('id_pegawai').notNull(),
        urut: integer('urut').notNull(),
        status: boolean('status'),
        tanggal_persetujuan: timestamp('tanggal_persetujuan', { mode: 'string' }),
        id_jabatan: integer('id_jabatan').default(0),
        keterangan: text('keterangan'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.id_pegawai] }),
        };
    }
);

export const insertPurchaseRequestPersetujuanSchema = createInsertSchema(purchase_request_persetujuan);
export const updatePurchaseRequestPersetujuanSchema = createInsertSchema(purchase_request_persetujuan).omit({ id: true, urut: true, id_jabatan: true });

export type PurchaseRequestPersetujuan = InferSelectModel<typeof purchase_request_persetujuan>;
export type NewPurchaseRequestPersetujuan = z.infer<typeof insertPurchaseRequestPersetujuanSchema>;
export type UpdatePurchaseRequestPersetujuan = z.infer<typeof updatePurchaseRequestPersetujuanSchema>;

export const PurchaseRequestPersetujuanColumns = getTableColumns(purchase_request_persetujuan);
