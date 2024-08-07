import { InferSelectModel } from 'drizzle-orm';
import { bigint, integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../schema';

export const barang_bahan_baku = pgTable(
    'barang_bahan_baku',
    {
        id: bigint('id', { mode: 'number' })
            .notNull()
            .references(() => barang.id),
        id_barang: bigint('id_barang', { mode: 'number' })
            .notNull()
            .references(() => barang.id),
        urut: integer('urut').notNull(),
        qty: numeric('qty').notNull(),
        harga_beli: numeric('harga_beli').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id_barang, table.id] }),
        };
    }
);

export const insertBarangBahanBakuSchema = createInsertSchema(barang_bahan_baku);

export type BarangBahanBaku = InferSelectModel<typeof barang_bahan_baku>;
export type NewBarangBahanBaku = z.infer<typeof insertBarangBahanBakuSchema>;
