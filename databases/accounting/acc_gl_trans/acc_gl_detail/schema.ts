import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { pgTable, integer, numeric, boolean, varchar, text, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { acc_gl_trans } from '../schema';
import { proyek } from '../../../proyek/schema';

export const acc_gl_detail = pgTable(
    'acc_gl_detail',
    {
        gl_number: varchar('gl_number', { length: 11 })
            .notNull()
            .references(() => acc_gl_trans.gl_number),
        id_kantor: integer('id_kantor'),
        id_proyek: integer('id_proyek').references(() => proyek.id),
        line: integer('line').notNull(),
        id_account: integer('id_account').notNull(),
        amount: numeric('amount').default('0'),
        is_debit: boolean('is_debit').notNull(),
        description: text('description'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.gl_number, table.line] }),
        };
    }
);

export const insertAccGlDetailSchema = createInsertSchema(acc_gl_detail);

export type AccGlDetail = InferSelectModel<typeof acc_gl_detail>;
export type NewAccGlDetail = z.infer<typeof insertAccGlDetailSchema>;

export const accGLDetailColumns = getTableColumns(acc_gl_detail);
