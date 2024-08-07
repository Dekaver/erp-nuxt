import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { numeric, pgTable, primaryKey, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { acc_ar_faktur } from '../../accounting/acc_ar_faktur/schema';
import { payment_ar } from '../schema';

export const payment_ar_detail = pgTable(
    'payment_ar_detail',
    {
        id: serial('id')
            .notNull()
            .references(() => payment_ar.id),
        invoice: varchar('invoice')
            .notNull()
            .references(() => acc_ar_faktur.invoice),
        ar_amount: numeric('ar_amount').default('0').notNull(),
        discount: numeric('discount').default('0').notNull(),
        amount: numeric('amount').default('0').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.invoice] }),
        };
    }
);

export const insertPaymentArDetailSchema = createInsertSchema(payment_ar_detail);

export type PaymentArDetail = InferSelectModel<typeof payment_ar_detail>;
export type NewPaymentArDetail = z.infer<typeof insertPaymentArDetailSchema>;

export const paymentArDetailColumns = getTableColumns(payment_ar_detail);
