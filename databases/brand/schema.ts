import { getTableColumns, type InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../../server/api/schema';

export const brand = pgTable('brand', {
    id: serial('id').primaryKey().notNull(),
    nama: varchar('nama').notNull(),
    ...timestamps,
});

export const insertBrandSchema = createInsertSchema(brand);
export const updateBrandSchema = createInsertSchema(brand).omit({ id: true, created_by: true, created_at: true });

export type Brand = InferSelectModel<typeof brand>;
export type NewBrand = z.infer<typeof insertBrandSchema>;
export type UpdateBrand = z.infer<typeof updateBrandSchema>;

export const BrandColumns = getTableColumns(brand);
