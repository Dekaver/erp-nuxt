import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { rencana_anggaran_biaya } from '../schema';

export const rencana_anggaran_biaya_detail = pgTable(
    'rencana_anggaran_biaya_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => rencana_anggaran_biaya.id),
        urut: integer('urut').notNull(),
        id_barang: integer('id_barang').references(() => barang.id),
        nama_barang: varchar('nama_barang').notNull(),
        deskripsi: varchar('deskripsi'),
        qty: numeric('qty').notNull(),
        diambil: numeric('diambil').default('0').notNull(),
        sisa: numeric('sisa').notNull(),
        invoice: numeric('invoice').default('0').notNull(),
        harga: numeric('harga').notNull(),
        total: numeric('total').notNull(),
        id_satuan: integer('id_satuan').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);

export const insertRencanaAnggaranBiayaDetailSchema = createInsertSchema(rencana_anggaran_biaya_detail);

export type RencanaAnggaranBiayaDetail = InferSelectModel<typeof rencana_anggaran_biaya_detail>;
export type NewRencanaAnggaranBiayaDetail = z.infer<typeof insertRencanaAnggaranBiayaDetailSchema>;

export const RencanaAnggaranBiayaDetailColumns = getTableColumns(rencana_anggaran_biaya_detail);
