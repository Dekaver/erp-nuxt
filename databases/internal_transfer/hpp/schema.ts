import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { internal_transfer } from '../schema';

export const internal_transfer_hpp = pgTable(
    'internal_transfer_hpp',
    {
        id: integer('id')
            .notNull()
            .references(() => internal_transfer.id),
        id_stok_barang: integer('id_stok_barang').notNull(),
        qty: numeric('qty').default('0').notNull(),
    },
    (table) => {
        return {
            pimaryKey: primaryKey({ columns: [table.id, table.id_stok_barang] }),
        };
    }
);

export const insertInternalTransferHppSchema = createInsertSchema(internal_transfer_hpp);

export type InternalTransferHpp = InferSelectModel<typeof internal_transfer_hpp>;
export type NewInternalTransferHpp = z.infer<typeof insertInternalTransferHppSchema>;

export const InternalTransferHppColumns = getTableColumns(internal_transfer_hpp);
