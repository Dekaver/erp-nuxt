import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { invoice } from '../schema';

export const invoice_hpp = pgTable(
    'invoice_hpp',
    {
        id: integer('id')
            .notNull()
            .references(() => invoice.id),
        id_stok_barang: integer('id_stok_barang').notNull(),
        qty: numeric('qty').default('0').notNull(),
    },
    (table) => {
        return {
            pimaryKey: primaryKey({ columns: [table.id, table.id_stok_barang] }),
        };
    }
);

export const insertInvoiceHppSchema = createInsertSchema(invoice_hpp);

export type InvoiceHpp = InferSelectModel<typeof invoice_hpp>;
export type NewInvoiceHpp = z.infer<typeof insertInvoiceHppSchema>;

export const DeliveryOrderHppColumns = getTableColumns(invoice_hpp);
