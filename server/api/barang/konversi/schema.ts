import { InferSelectModel } from 'drizzle-orm';
import { primaryKey } from 'drizzle-orm/pg-core';
import { pgTable, integer, numeric, bigint } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../schema';
import { satuan } from '../satuan/schema';

export const barang_konversi = pgTable(
    'barang_konversi',
    {
        id_barang: bigint('id_barang', { mode: 'number' })
            .notNull()
            .references(() => barang.id),
        id_satuan: integer('id_satuan')
            .notNull()
            .references(() => satuan.id),
        konversi: numeric('konversi').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id_barang, table.id_satuan] }),
        };
    }
);

export const insertBarangSatuanSchema = createInsertSchema(barang_konversi);

export type BarangSatuan = InferSelectModel<typeof barang_konversi>;
export type NewBarangSatuan = z.infer<typeof insertBarangSatuanSchema>;
