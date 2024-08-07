import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { delivery_order } from '../../delivery_order/schema';
import { invoice } from '../schema';

export const invoice_delivery_order = pgTable(
    'invoice_delivery_order',
    {
        id_invoice: integer('id_invoice')
            .notNull()
            .references(() => invoice.id),
        id_delivery_order: integer('id_delivery_order')
            .notNull()
            .references(() => delivery_order.id),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id_invoice, table.id_delivery_order] }),
        };
    }
);

export const insertInvoiceDeliveryOrderSchema = createInsertSchema(invoice_delivery_order);

export type InvoiceDeliveryOrder = InferSelectModel<typeof invoice_delivery_order>;
export type NewInvoiceDeliveryOrder = z.infer<typeof insertInvoiceDeliveryOrderSchema>;

export const InvoiceDeliveryOrderColumns = getTableColumns(invoice_delivery_order);
