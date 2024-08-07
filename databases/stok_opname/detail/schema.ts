import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { gudang } from '../../gudang/schema';
import { stok_opname } from '../schema';

export const stok_opname_detail = pgTable(
    'stok_opname_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => stok_opname.id),
        urut: integer('urut').notNull(),
        id_barang: integer('id_barang').notNull(),
        id_gudang: integer('id_gudang')
            .notNull()
            .references(() => gudang.id),
        qty: numeric('qty').notNull(),
        qty_stok: numeric('qty_stok').notNull(),
        selisih: numeric('selisih').notNull(),
        isi_satuan: numeric('isi_satuan'),
        is_reason: boolean('isreason').default(false).notNull(),
        is_selected: boolean('is_selected').notNull().default(true),
        notes: varchar('notes'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);

export const insertStokOpnameDetailSchema = createInsertSchema(stok_opname_detail);

export type StokOpnameDetail = InferSelectModel<typeof stok_opname_detail>;
export type NewStokOpnameDetail = z.infer<typeof insertStokOpnameDetailSchema>;

export const StokOpnameDetailColumns = getTableColumns(stok_opname_detail);
