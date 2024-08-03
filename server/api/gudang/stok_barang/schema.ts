import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { date, integer, numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { timestamps } from '../../schema';
import { gudang } from '../schema';

export const stok_barang = pgTable('stok_barang', {
    id: serial('id').primaryKey().notNull(),
    id_gudang: integer('id_gudang')
        .notNull()
        .references(() => gudang.id),
    id_barang: integer('id_barang')
        .notNull()
        .references(() => barang.id),
    stok: numeric('stok').notNull(),
    stok_awal: numeric('stok_awal').notNull(),
    tanggal: date('tanggal').notNull(),
    hpp: numeric('hpp').notNull().default('0'),
    batch: varchar('batch', { length: 100 }),
    reff: varchar('reff', { length: 5 }).notNull(),
    id_reff: integer('id_reff').notNull(),
    ...timestamps,
});

export const insertStokBarangSchema = createInsertSchema(stok_barang);
export const updateStokBarangSchema = createInsertSchema(stok_barang).omit({
    id: true,
    batch: true,
    tanggal: true,
    reff: true,
    id_reff: true,
    created_by: true,
    created_at: true,
});

export type StokBarang = InferSelectModel<typeof stok_barang>;
export type NewStokBarang = z.infer<typeof insertStokBarangSchema>;
export type UpdateStokBarang = z.infer<typeof updateStokBarangSchema>;

export const StokBarangColumns = getTableColumns(stok_barang);
