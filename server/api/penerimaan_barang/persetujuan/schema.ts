import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { penerimaan_barang } from '../schema';

export const penerimaan_barang_persetujuan = pgTable(
    'penerimaan_barang_persetujuan',
    {
        id: integer('id')
            .notNull()
            .references(() => penerimaan_barang.id),
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

export const insertPenerimaanBarangPersetujuanSchema = createInsertSchema(penerimaan_barang_persetujuan);

export type PenerimaanBarangPersetujuan = InferSelectModel<typeof penerimaan_barang_persetujuan>;
export type NewPenerimaanBarangPersetujuan = z.infer<typeof insertPenerimaanBarangPersetujuanSchema>;

export const PenerimaanBarangPersetujuanColumns = getTableColumns(penerimaan_barang_persetujuan);
