import { type InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const kantor = pgTable('kantor', {
    id: serial('id').primaryKey().notNull(),
    numbercode: varchar('numbercode', { length: 25 }).notNull(),
    nama: varchar('nama', { length: 25 }).notNull(),
    telepon: varchar('telepon', { length: 15 }),
    email: varchar('email', { length: 30 }),
    alamat: text('alamat'),
    account_penjualan: integer('account_penjualan').notNull(),
    account_piutang: integer('account_piutang').notNull(),
    account_hutang: integer('account_hutang').notNull(),
    ...timestamps,
});

export const insertKantorSchema = createInsertSchema(kantor);
export const updateKantorSchema = createInsertSchema(kantor).omit({ id: true, created_by: true, created_at: true });

export type Kantor = InferSelectModel<typeof kantor>;
export type NewKantor = z.infer<typeof insertKantorSchema>;
export type UpdateKantor = z.infer<typeof updateKantorSchema>;

export const KantorColumns = getTableColumns(kantor);
