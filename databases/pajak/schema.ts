import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../account/schema';
import { timestamps } from '../schema';

export const pajak = pgTable('pajak', {
    id: serial('id').primaryKey().notNull(),
    nama: varchar('nama', { length: 30 }).notNull(),
    nilai: numeric('nilai').default('0').notNull(),
    is_potong: boolean('is_potong').default(false).notNull(),
    akun_pembelian: integer('akun_pembelian')
        .notNull()
        .references(() => account.id),
    akun_penjualan: integer('akun_penjualan')
        .notNull()
        .references(() => account.id),
    jenis: varchar('jenis'),
    ...timestamps,
});

export const insertPajakSchema = createInsertSchema(pajak);
export const updatePajakSchema = insertPajakSchema.omit({ id: true, created_by: true, created_at: true });

export type Pajak = InferSelectModel<typeof pajak>;
export type NewPajak = z.infer<typeof insertPajakSchema>;
export type NilaiPajak = { id: number; nama: string; nilai: string };
export type Updatepajak = z.infer<typeof updatePajakSchema>;

export const PajakColumns = getTableColumns(pajak);
