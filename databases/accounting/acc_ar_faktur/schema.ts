import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { date, integer, numeric, pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { kontak } from '../../kontak/schema';
import { timestamps } from '../../schema';
import { top } from '../../top/schema';

export const acc_ar_faktur = pgTable('acc_ar_faktur', {
    invoice: varchar('invoice').primaryKey().notNull(),
    invoice_date: date('invoice_date').notNull(),
    id_customer: integer('id_customer')
        .notNull()
        .references(() => kontak.id),
    id_top: integer('id_top')
        .notNull()
        .references(() => top.id),
    amount: numeric('amount').default('0').notNull(),
    pay: numeric('pay').default('0').notNull(),
    discount: numeric('discount').default('0').notNull(),
    top: integer('top').notNull().default(0),
    due_date: date('due_date').notNull(),
    ...timestamps,
});

export const insertAccArFakturSchema = createInsertSchema(acc_ar_faktur);
export const updateAccArFakturSchema = createInsertSchema(acc_ar_faktur).omit({ invoice: true, created_by: true, updated_by: true });

export type AccArFaktur = InferSelectModel<typeof acc_ar_faktur>;
export type NewAccArFaktur = z.infer<typeof insertAccArFakturSchema>;
export type UpdateAccArFaktur = z.infer<typeof updateAccArFakturSchema>;

export const AccArFakturColumns = getTableColumns(acc_ar_faktur);
