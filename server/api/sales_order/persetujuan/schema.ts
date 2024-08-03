import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { sales_order } from '../schema';

export const sales_order_persetujuan = pgTable(
    'sales_order_persetujuan',
    {
        id: integer('id')
            .notNull()
            .references(() => sales_order.id),
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

export const insertSalesOrderPersetujuanSchema = createInsertSchema(sales_order_persetujuan);
export const updateSalesOrderPersetujuanSchema = createInsertSchema(sales_order_persetujuan).omit({ id: true, urut: true, id_jabatan: true, id_pegawai: true });

export type SalesOrderPersetujuan = InferSelectModel<typeof sales_order_persetujuan>;
export type NewSalesOrderPersetujuan = z.infer<typeof insertSalesOrderPersetujuanSchema>;

export const SalesOrderPersetujuanColumns = getTableColumns(sales_order_persetujuan);
