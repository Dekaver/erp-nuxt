import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../account/schema';
import { timestamps } from '../schema';

export const gudang = pgTable('gudang', {
    id: serial('id').primaryKey().notNull(),
    gudang: varchar('gudang', { length: 100 }).notNull(),
    telepon: varchar('telepon', { length: 20 }),
    alamat: text('alamat'),
    inisial: varchar('inisial', { length: 15 }),
    account_hpp: integer('account_hpp'),
    account_persediaan: integer('account_persediaan').references(() => account.id),
    blind: boolean('blind').default(true).notNull(),
    stokopname: boolean('stokopname').default(false).notNull(),
    id_kantor: integer('id_kantor').notNull(),
    ...timestamps,
});

export const insertGudangSchema = createInsertSchema(gudang);
export const updateGudangSchema = createInsertSchema(gudang).omit({ id: true, created_by: true, created_at: true });

export type Gudang = InferSelectModel<typeof gudang>;
export type NewGudang = z.infer<typeof insertGudangSchema>;
export type UpdateGudang = z.infer<typeof updateGudangSchema>;

export const GudangColumns = getTableColumns(gudang);
