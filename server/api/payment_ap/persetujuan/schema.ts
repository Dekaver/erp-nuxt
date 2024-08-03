import { boolean, integer, numeric, pgTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { payment_ap } from '../schema';
import { createInsertSchema } from 'drizzle-zod';
import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';

export const payment_ap_persetujuan = pgTable(
    'payment_ap_persetujuan',
    {
        id: integer('id')
            .notNull()
            .references(() => payment_ap.id),
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

export const insertPaymentApPersetujuanSchema = createInsertSchema(payment_ap_persetujuan);
export const updatePaymentApPersetujuanSchema = insertPaymentApPersetujuanSchema.omit({ id: true, id_jabatan: true, id_pegawai: true, urut: true });

export type PaymentApPersetujuan = InferSelectModel<typeof payment_ap_persetujuan>;
export type NewPaymentApPersetujuan = z.infer<typeof insertPaymentApPersetujuanSchema>;
export type UpdatePaymentApPersetujuan = z.infer<typeof updatePaymentApPersetujuanSchema>;

export const paymentApPersetujuanColumns = getTableColumns(payment_ap_persetujuan);
