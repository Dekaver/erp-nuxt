import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { boolean, integer, json, numeric, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../account/schema';
import { brand } from '../brand/schema';
import { timestamps } from '../schema';
import { kategori_barang } from './kategori/schema';
import { satuan } from './satuan/schema';

export const barang = pgTable('barang', {
    id: serial('id').primaryKey().notNull(),
    kode_barang: varchar('kode_barang', { length: 30 }).notNull(),
    nama_barang: varchar('nama_barang').notNull(),
    images: text('images'),
    barcode: text('barcode'),
    status: boolean('status'),
    keterangan: varchar('keterangan', { length: 250 }),
    id_brand: integer('id_brand').references(() => brand.id),
    id_kategori: integer('id_kategori').references(() => kategori_barang.id),
    id_satuan: integer('id_satuan')
        .references(() => satuan.id)
        .notNull(),
    harga_jual: numeric('harga_jual').default('0').notNull(),
    harga_beli: numeric('harga_beli').default('0').notNull(),
    id_account_harga_beli: integer('id_account_harga_beli').references(() => account.id),
    is_stok: boolean('is_stok'),
    is_bundling: boolean('is_bundling').default(false),
    is_dijual: boolean('is_dijual').default(false),
    is_dibeli: boolean('is_dibeli').default(false),
    optional: json('optional'),
    ...timestamps,
});

export const insertBarangSchema = createInsertSchema(barang);
export const updateBarangSchema = createInsertSchema(barang).omit({ id: true, created_by: true, created_at: true });

export type Barang = InferSelectModel<typeof barang>;
export type NewBarang = z.infer<typeof insertBarangSchema>;
export type UpdateBarang = z.infer<typeof updateBarangSchema>;

export const BarangColumns = getTableColumns(barang);
