import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { AnyPgColumn, boolean, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../schema';

export const jabatan = pgTable('jabatan', {
    id: serial('id').primaryKey().notNull(),
    jabatan: varchar('name').notNull(),
    is_head_departemen: boolean('is_head_departemen').default(false),
    atasan: integer('atasan').references((): AnyPgColumn => jabatan.id, { onDelete: 'set null' }),
    ...timestamps,
});

export const insertJabatanSchema = createInsertSchema(jabatan);
export const updateJabatanSchema = createInsertSchema(jabatan).omit({ id: true, created_by: true, created_at: true });

export type Jabatan = InferSelectModel<typeof jabatan>;
export type NewJabatan = z.infer<typeof insertJabatanSchema>;
export type UpdateJabatan = z.infer<typeof updateJabatanSchema>;

export const JabatanColumns = getTableColumns(jabatan);
