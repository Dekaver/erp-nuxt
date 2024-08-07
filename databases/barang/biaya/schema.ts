import { InferSelectModel } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../../account/schema';
import { barang } from '../schema';

export const barang_biaya = pgTable(
    'barang_biaya',
    {
        id: integer('id')
            .notNull()
            .references(() => barang.id),
        id_account: integer('id_account')
            .notNull()
            .references(() => account.id),
        urut: integer('urut').notNull(),
        biaya: numeric('biaya').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.id_account] }),
        };
    }
);

export const insertBarangBiayaSchema = createInsertSchema(barang_biaya);

export type BarangBiaya = InferSelectModel<typeof barang_biaya>;
export type NewBarangBiaya = z.infer<typeof insertBarangBiayaSchema>;
