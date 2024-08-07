import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { date, integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { gudang } from '../schema';

export const stok_harian = pgTable(
    'stok_harian',
    {
        id_barang: integer('id_barang')
            .notNull()
            .references(() => barang.id),
        id_gudang: integer('id_gudang')
            .notNull()
            .references(() => gudang.id),
        tanggal: date('tanggal').notNull(),
        masuk: numeric('masuk').notNull(),
        keluar: numeric('keluar').notNull(),
    },
    (table) => {
        return {
            primariKey: primaryKey({ columns: [table.id_barang, table.tanggal] }),
        };
    }
);

// Create an insert schema for the stok_harian table
export const insertStokHarianSchema = createInsertSchema(stok_harian);
export const updateStokHarianSchema = createInsertSchema(stok_harian).omit({ id_barang: true, id_gudang: true, tanggal: true });

// Define types for StokHarian and NewStokHarian
export type StokHarian = InferSelectModel<typeof stok_harian>;
export type NewStokHarian = z.infer<typeof insertStokHarianSchema>;
export type UpdateStokHarian = z.infer<typeof updateStokHarianSchema>;

// Get columns for the stok_harian table
export const StokHarianColumns = getTableColumns(stok_harian);
