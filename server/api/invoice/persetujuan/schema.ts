import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { invoice } from '../schema';

export const invoice_persetujuan = pgTable(
    'invoice_persetujuan',
    {
        id: integer('id')
            .notNull()
            .references(() => invoice.id),
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

export const insertInvoicePersetujuanSchema = createInsertSchema(invoice_persetujuan);
export const updateInvoicePersetujuanSchema = createInsertSchema(invoice_persetujuan).omit({ id: true, urut: true, id_jabatan: true, id_pegawai: true });

export type InvoicePersetujuan = InferSelectModel<typeof invoice_persetujuan>;
export type NewInvoicePersetujuan = z.infer<typeof insertInvoicePersetujuanSchema>;

export const InvoicePersetujuanColumns = getTableColumns(invoice_persetujuan);
