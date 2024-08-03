import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const internal_perusahaan = pgTable('internal_perusahaan', {
    id: serial('id').primaryKey().notNull(),
    nama_perusahaan: varchar('nama_perusahaan').notNull(),
    inisial: varchar('inisial').notNull(),
    logo: varchar('logo').notNull(),
    address: text('address'),
    city: varchar('city').notNull(),
    phone: varchar('phone', { length: 15 }),
    email: varchar('email', { length: 100 }),
    web: varchar('web', { length: 100 }),
    bank_number: varchar('bank_number'),
    bank_name: varchar('bank_name'),
    bank_account: varchar('bank_account'),
    ...timestamps,
});

export const insertInternalPerusahaanSchema = createInsertSchema(internal_perusahaan);
export const updateInternalPerusahaanSchema = createInsertSchema(internal_perusahaan).omit({ id: true, created_by: true, created_at: true });

export type InternalPerusahaan = InferSelectModel<typeof internal_perusahaan>;
export type NewInternalPerusahaan = z.infer<typeof insertInternalPerusahaanSchema>;
export type UpdateInternalPerusahaan = z.infer<typeof updateInternalPerusahaanSchema>;

export const InternalPerusahaanColumns = getTableColumns(internal_perusahaan);
