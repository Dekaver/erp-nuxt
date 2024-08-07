import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { payment_ar } from '../schema';

export const payment_ar_persetujuan = pgTable(
    'payment_ar_persetujuan',
    {
        id: integer('id')
            .notNull()
            .references(() => payment_ar.id),
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

export const insertPaymentArPersetujuanSchema = createInsertSchema(payment_ar_persetujuan);
export const updatePaymentArPersetujuanSchema = createInsertSchema(payment_ar_persetujuan).omit({ id: true, urut: true, id_jabatan: true, id_pegawai: true });

export type PaymentArPersetujuan = InferSelectModel<typeof payment_ar_persetujuan>;
export type NewPaymentArPersetujuan = z.infer<typeof insertPaymentArPersetujuanSchema>;
export type UpdatePaymentArPersetujuan = z.infer<typeof updatePaymentArPersetujuanSchema>;

export const PaymentArSettingColumns = getTableColumns(payment_ar_persetujuan);
