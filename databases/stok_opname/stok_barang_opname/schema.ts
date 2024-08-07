import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { date, integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { gudang } from '../../gudang/schema';
import { stok_barang } from '../../gudang/stok_barang/schema';
import { stok_opname } from '../schema';

export const stok_barang_opname = pgTable(
    'stok_barang_opname',
    {
        id: integer('id')
            .notNull()
            .references(() => stok_opname.id),
        urut: integer('urut').notNull(),
        id_gudang: integer('id_gudang')
            .notNull()
            .references(() => gudang.id),
        id_barang: integer('id_barang')
            .notNull()
            .references(() => barang.id),
        id_stok: integer('id_stok')
            .notNull()
            .references(() => stok_barang.id),
        id_reff: integer('id_reff').notNull(),
        tanggal: date('tanggal', { mode: 'string' }).notNull(),
        reff: varchar('reff', { length: 100 }),
        stok: numeric('stok').notNull(),
        stok_awal: numeric('stok_awal').notNull(),
        hpp: numeric('hpp'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);

export const insertStokBarangOpnameSchema = createInsertSchema(stok_barang_opname);
export const updateStokBarangOpnameSchema = createInsertSchema(stok_barang_opname).omit({ id: true });

export type StokBarangOpname = InferSelectModel<typeof stok_barang_opname>;
export type NewStokBarangOpname = z.infer<typeof insertStokBarangOpnameSchema>;
export type UpdateStokBarangOpname = z.infer<typeof updateStokBarangOpnameSchema>;

export const StokBarangOpnameColumns = getTableColumns(stok_barang_opname);
