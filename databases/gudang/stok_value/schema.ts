import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { gudang } from '../schema';

export const stok_value = pgTable(
    'stok_value',
    {
        tahun: integer('tahun').notNull(),
        id_barang: integer('id_barang')
            .notNull()
            .references(() => barang.id),
        id_gudang: integer('id_gudang')
            .references(() => gudang.id)
            .notNull(),
        db0: numeric('db0').default('0'),
        db1: numeric('db1').default('0'),
        db2: numeric('db2').default('0'),
        db3: numeric('db3').default('0'),
        db4: numeric('db4').default('0'),
        db5: numeric('db5').default('0'),
        db6: numeric('db6').default('0'),
        db7: numeric('db7').default('0'),
        db8: numeric('db8').default('0'),
        db9: numeric('db9').default('0'),
        db10: numeric('db10').default('0'),
        db11: numeric('db11').default('0'),
        db12: numeric('db12').default('0'),
        db13: numeric('db13').default('0'),
        cr0: numeric('cr0').default('0'),
        cr1: numeric('cr1').default('0'),
        cr2: numeric('cr2').default('0'),
        cr3: numeric('cr3').default('0'),
        cr4: numeric('cr4').default('0'),
        cr5: numeric('cr5').default('0'),
        cr6: numeric('cr6').default('0'),
        cr7: numeric('cr7').default('0'),
        cr8: numeric('cr8').default('0'),
        cr9: numeric('cr9').default('0'),
        cr10: numeric('cr10').default('0'),
        cr11: numeric('cr11').default('0'),
        cr12: numeric('cr12').default('0'),
        cr13: numeric('cr13').default('0'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.tahun, table.id_barang, table.id_gudang] }),
        };
    }
);

export const insertStokValueSchema = createInsertSchema(stok_value);
export const updateStokValueSchema = insertStokValueSchema.omit({ id_gudang: true, id_barang: true, tahun: true });

export type StokValue = InferSelectModel<typeof stok_value>;
export type NewStokValue = z.infer<typeof insertStokValueSchema>;

export const stokValueColumns = getTableColumns(stok_value);
