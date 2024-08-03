import { getTableColumns, InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../../schema";

export const quotation_setting = pgTable("quotation_setting", {
    id: serial("id").primaryKey().notNull(),
    persetujuan1: varchar("persetujuan1", { length: 1 }),
    persetujuan2: varchar("persetujuan2", { length: 1 }),
    persetujuan3: varchar("persetujuan3", { length: 1 }),
    persetujuan4: varchar("persetujuan4", { length: 1 }),
    jabatan_persetujuan1: integer("jabatan_persetujuan1"),
    jabatan_persetujuan2: integer("jabatan_persetujuan2"),
    jabatan_persetujuan3: integer("jabatan_persetujuan3"),
    jabatan_persetujuan4: integer("jabatan_persetujuan4"),
    ...timestamps,
});

export const insertQuotationSettingSchema = createInsertSchema(quotation_setting);
export const updateQuotationSettingSchema = createInsertSchema(quotation_setting).omit({id: true, created_by: true, created_at: true});

export type QuotationSetting = InferSelectModel<typeof quotation_setting>;
export type NewQuotationSetting = z.infer<typeof insertQuotationSettingSchema>;
export type UpdateQuotationSetting = z.infer<typeof updateQuotationSettingSchema>;

export const QuotationSettingColumns = getTableColumns(quotation_setting);
