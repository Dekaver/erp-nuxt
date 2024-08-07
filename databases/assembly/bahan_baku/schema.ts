import { InferSelectModel } from 'drizzle-orm';
import { bigint, integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { assembly } from '../schema';
import { satuan } from '../../barang/satuan/schema';

export const assembly_bahan_baku = pgTable(
    'assembly_bahan_baku',
    {
        id: bigint('id', { mode: 'number' })
            .notNull()
            .references(() => assembly.id),
        id_barang: bigint('id_barang', { mode: 'number' })
            .notNull()
            .references(() => barang.id),
        id_satuan: bigint('id_satuan', { mode: 'number' })
            .notNull()
            .references(() => satuan.id),
        urut: integer('urut').notNull(),
        bahan: numeric('bahan').notNull(),
        qty: numeric('qty').notNull(),
        harga_beli: numeric('harga_beli').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id_barang, table.id] }),
        };
    }
);

export const insertAssemblyBahanBakuSchema = createInsertSchema(assembly_bahan_baku);

export type AssemblyBahanBaku = InferSelectModel<typeof assembly_bahan_baku>;
export type NewAssemblyBahanBaku = z.infer<typeof insertAssemblyBahanBakuSchema>;
