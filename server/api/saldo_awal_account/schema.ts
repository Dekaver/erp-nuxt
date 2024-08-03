import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../account/schema';
import { timestamps } from '../schema';

export const initial_account = pgTable('initial_account', {
    id_account: integer('id_account')
        .primaryKey()
        .notNull()
        .references(() => account.id),
    amount: numeric('amount').notNull(),
    ...timestamps,
});

export const insertInitialAccountSchema = createInsertSchema(initial_account);
export const updateInitialAccountSchema = createInsertSchema(initial_account).omit({ created_by: true, created_at: true });

export type InitialAccount = InferSelectModel<typeof initial_account>;
export type NewInitialAccount = z.infer<typeof insertInitialAccountSchema>;
export type UpdateInitialAccount = z.infer<typeof updateInitialAccountSchema>;

export const InitialAccountColunms = getTableColumns(initial_account);
