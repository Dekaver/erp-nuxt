import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { payment_ap } from '../schema';

export const payment_ap_detail = pgTable(
    'payment_ap_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => payment_ap.id),
        ap_number: varchar('ap_number', { length: 15 }).notNull(),
        ap_amount: numeric('ap_amount').default('0').notNull(),
        discount: numeric('discount').default('0').notNull(),
        amount: numeric('amount').default('0').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.ap_number] }),
        };
    }
);

export const insertPaymentApDetailSchema = createInsertSchema(payment_ap_detail);

export type PaymentApDetail = InferSelectModel<typeof payment_ap_detail>;
export type NewPaymentApDetail = z.infer<typeof insertPaymentApDetailSchema>;

export const PaymentApDetailColumns = getTableColumns(payment_ap_detail);
