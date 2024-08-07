import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { ap } from '../schema';

export const ap_penerimaan_barang = pgTable(
    "ap_penerimaan_barang",
    {
        id_ap: integer("id_ap")
            .notNull()
            .references(() => ap.id),
        id_penerimaan_barang: integer("id_penerimaan_barang").notNull(),
    },
    (table) => {
        return {
            poDetailPkey: primaryKey({ columns: [table.id_ap, table.id_penerimaan_barang] }),
        };
    },
);

export const insertApPenerimaanBarangSchema = createInsertSchema(ap_penerimaan_barang);

export type ApPenerimaanBarang = InferSelectModel<typeof ap_penerimaan_barang>;
export type NewApPenerimaanBarang = z.infer<typeof insertApPenerimaanBarangSchema>;

export const apPenerimaanbarangColumns = getTableColumns(ap_penerimaan_barang);
