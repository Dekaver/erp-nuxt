import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { char, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const settingAkuntansi = pgTable('setting_akuntansi', {
    persediaan_hpp: char('persediaan_hpp', { length: 1 }),
    pendapatan: char('pendapatan', { length: 1 }),
    year: varchar('year', { length: 4 }).notNull(),
    month: integer('month').notNull(),
});

export const insertSettingAkuntansiSchema = createInsertSchema(settingAkuntansi);

export type SettingAkuntansi = InferSelectModel<typeof settingAkuntansi>;
export type NewSettingAkuntansi = z.infer<typeof insertSettingAkuntansiSchema>;

export const settingAkuntansiColumns = getTableColumns(settingAkuntansi);
