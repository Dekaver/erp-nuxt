import { primaryKey } from 'drizzle-orm/pg-core';
import { pgTable, integer, numeric } from 'drizzle-orm/pg-core';
import { gudang } from '../../gudang/schema';
import { barang } from '../schema';

export const barangMinmax = pgTable(
    'barang_minmax',
    {
        id_gudang: integer('id_gudang')
            .notNull()
            .references(() => gudang.id),
        id_barang: integer('id_barang')
            .notNull()
            .references(() => barang.id),
        min: numeric('min').default('0').notNull(),
        max: numeric('max').default('0').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id_gudang, table.id_barang] }),
        };
    }
);
