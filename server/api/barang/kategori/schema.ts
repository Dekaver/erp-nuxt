import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../../account/schema';
import { timestamps } from '../../schema';

export const kategori_barang = pgTable('kategori_barang', {
    id: serial('id').primaryKey().notNull(),
    nama: varchar('nama').notNull(),
    id_account: integer('id_account')
        .notNull()
        .references(() => account.id),
    ...timestamps,
});

export const insertKategoriBarangSchema = createInsertSchema(kategori_barang);
export const updateKategoriBarangSchema = createInsertSchema(kategori_barang).omit({ id: true, created_by: true, created_at: true });

export type KategoriBarang = InferSelectModel<typeof kategori_barang>;
export type NewKategoriBarang = z.infer<typeof insertKategoriBarangSchema>;
export type UpdateKategoriBarang = z.infer<typeof updateKategoriBarangSchema>;

export const KategoriBarangColumns = getTableColumns(kategori_barang);
