import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../account/schema';

export const acc_value = pgTable(
    'acc_value',
    {
        years: varchar('years', { length: 4 }).notNull(),
        id_account: integer('id_account')
            .notNull()
            .references(() => account.id),
        db0: numeric('db0').default('0').notNull(),
        db1: numeric('db1').default('0').notNull(),
        db2: numeric('db2').default('0').notNull(),
        db3: numeric('db3').default('0').notNull(),
        db4: numeric('db4').default('0').notNull(),
        db5: numeric('db5').default('0').notNull(),
        db6: numeric('db6').default('0').notNull(),
        db7: numeric('db7').default('0').notNull(),
        db8: numeric('db8').default('0').notNull(),
        db9: numeric('db9').default('0').notNull(),
        db10: numeric('db10').default('0').notNull(),
        db11: numeric('db11').default('0').notNull(),
        db12: numeric('db12').default('0').notNull(),
        db13: numeric('db13').default('0').notNull(),
        cr0: numeric('cr0').default('0').notNull(),
        cr1: numeric('cr1').default('0').notNull(),
        cr2: numeric('cr2').default('0').notNull(),
        cr3: numeric('cr3').default('0').notNull(),
        cr4: numeric('cr4').default('0').notNull(),
        cr5: numeric('cr5').default('0').notNull(),
        cr6: numeric('cr6').default('0').notNull(),
        cr7: numeric('cr7').default('0').notNull(),
        cr8: numeric('cr8').default('0').notNull(),
        cr9: numeric('cr9').default('0').notNull(),
        cr10: numeric('cr10').default('0').notNull(),
        cr11: numeric('cr11').default('0').notNull(),
        cr12: numeric('cr12').default('0').notNull(),
        cr13: numeric('cr13').default('0').notNull(),
    },
    (table) => {
        return {
            accValuePkey: primaryKey({ columns: [table.years, table.id_account] }),
        };
    }
);

export const insertAccValueSchema = createInsertSchema(acc_value);
export const updateAccValueSchema = createInsertSchema(acc_value).omit({ years: true, id_account: true });

export type AccValue = InferSelectModel<typeof acc_value>;
export type NewAccValue = z.infer<typeof insertAccValueSchema>;
export type UpdateAccValue = z.infer<typeof updateAccValueSchema>;

export const AccValueColumns = getTableColumns(acc_value);
