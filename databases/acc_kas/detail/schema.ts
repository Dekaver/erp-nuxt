import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../../account/schema';
import { proyek } from '../../proyek/schema';
import { acc_kas } from '../schema';

export const acc_kas_detail = pgTable(
    'acc_kas_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => acc_kas.id),
        line: integer('line').notNull(),
        id_account: integer('id_account')
            .notNull()
            .references(() => account.id),
        id_proyek: integer('id_proyek').references(() => proyek.id),
        desc: varchar('desc').notNull(),
        amount: numeric('amount').default('0').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.line] }),
        };
    }
);

export const insertAccKasDetailSchema = createInsertSchema(acc_kas_detail);

export type AccKasDetail = InferSelectModel<typeof acc_kas_detail>;
export type NewAccKasDetail = z.infer<typeof insertAccKasDetailSchema>;

export const AccKasDetailColumns = getTableColumns(acc_kas_detail);
