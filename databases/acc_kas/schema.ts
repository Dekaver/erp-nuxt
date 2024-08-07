import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { char, date, integer, numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../account/schema';

export const acc_kas = pgTable('acc_kas', {
    id: serial('id').notNull().primaryKey(),
    date: date('date').notNull(),
    reference: varchar('reference', { length: 20 }).notNull(),
    akun: integer('akun')
        .notNull()
        .references(() => account.id),
    id_kepada: integer('id_kepada'),
    kepada: varchar('kepada', { length: 100 }).notNull(),
    description: varchar('description').notNull(),
    total: numeric('total').default('0').notNull(),
    type: char('type', { length: 1 }).notNull(),
    status: char('status', { length: 1 }).notNull(),
});

export const insertAccKasSchema = createInsertSchema(acc_kas);

export type AccKas = InferSelectModel<typeof acc_kas>;
export type NewAccKas = z.infer<typeof insertAccKasSchema>;

export const AccKasColumns = getTableColumns(acc_kas);
