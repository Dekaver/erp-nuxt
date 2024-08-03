import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { delivery_order } from '../schema';

export const delivery_order_persetujuan = pgTable(
    'delivery_order_persetujuan',
    {
        id: integer('id')
            .notNull()
            .references(() => delivery_order.id),
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

export const insertDeliveryOrderPersetujuanSchema = createInsertSchema(delivery_order_persetujuan);
export const updateDeliveryOrderPersetujuanSchema = createInsertSchema(delivery_order_persetujuan).omit({ id: true, urut: true, id_jabatan: true, id_pegawai: true });

export type DeliveryOrderPersetujuan = InferSelectModel<typeof delivery_order_persetujuan>;
export type NewDeliveryOrderPersetujuan = z.infer<typeof insertDeliveryOrderPersetujuanSchema>;
export type UpdateDeliveryOrderPersetujuan = z.infer<typeof updateDeliveryOrderPersetujuanSchema>;

export const deliveryOrderPersetujuanColumns = getTableColumns(delivery_order_persetujuan);
