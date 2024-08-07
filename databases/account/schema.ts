import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { AnyPgColumn, boolean, integer, pgTable, serial, smallint, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const account = pgTable('account', {
    id: serial('id').primaryKey().notNull(),
    id_category: integer('id_category')
        .notNull()
        .references((): AnyPgColumn => account.id),
    code: varchar('code', { length: 15 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    level: smallint('level').notNull(),
    is_cash: boolean('is_cash').notNull().default(false),
    is_active: boolean('is_active').notNull().default(true),
    parent: integer('parent').references((): AnyPgColumn => account.id),
    ...timestamps,
});

export const insertAccountSchema = createInsertSchema(account);
export const updateAccountSchema = createInsertSchema(account).omit({ id: true, created_by: true, created_at: true });

export type Account = InferSelectModel<typeof account>;
export type NewAccount = z.infer<typeof insertAccountSchema>;
export type UpdateAccount = z.infer<typeof updateAccountSchema>;

export const AccountColumns = getTableColumns(account);
