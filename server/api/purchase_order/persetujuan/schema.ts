import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { purchase_order } from '../schema';

export const purchase_order_persetujuan = pgTable(
    'purchase_order_persetujuan',
    {
        id: integer('id')
            .notNull()
            .references(() => purchase_order.id),
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

export const insertPurchaseOrderPersetujuanSchema = createInsertSchema(purchase_order_persetujuan);
export const updatePurchaseOrderPersetujuanSchema = createInsertSchema(purchase_order_persetujuan).omit({ id: true, urut: true, id_jabatan: true, id_pegawai: true });

export type PurchaseOrderPersetujuan = InferSelectModel<typeof purchase_order_persetujuan>;
export type NewPurchaseOrderPersetujuan = z.infer<typeof insertPurchaseOrderPersetujuanSchema>;
export type UpdatePurchaseOrderPersetujuan = z.infer<typeof updatePurchaseOrderPersetujuanSchema>;

export const PurchaseOrderPersetujuanColumns = getTableColumns(purchase_order_persetujuan);
