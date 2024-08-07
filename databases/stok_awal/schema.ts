import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { integer, numeric, pgTable, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../barang/schema';
import { gudang } from '../gudang/schema';
import { timestamps } from '../schema';

export const stok_awal_barang = pgTable('stok_awal_barang', {
    id: serial('id').notNull().primaryKey(),
    id_barang: integer('id_barang')
        .notNull()
        .references(() => barang.id),
    id_gudang: integer('id_gudang')
        .notNull()
        .references(() => gudang.id),
    qty: numeric('qty').notNull(),
    hpp: numeric('hpp').notNull(),
    ...timestamps,
});

export const insertStokAwalBarangSchema = createInsertSchema(stok_awal_barang);
export const updateStokAwalBarangSchema = createInsertSchema(stok_awal_barang).omit({ id: true, created_by: true, created_at: true });

export type StokAwalBarang = InferSelectModel<typeof stok_awal_barang>;
export type NewStokAwalBarang = z.infer<typeof insertStokAwalBarangSchema>;
export type UpdateStokAwalBarang = z.infer<typeof updateStokAwalBarangSchema>;

export const StokAwalColumns = getTableColumns(stok_awal_barang);
