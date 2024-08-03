import { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "../../schema";

export const ap_setting = pgTable("ap_setting", {
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

export const insertApSettingSchema = createInsertSchema(ap_setting);
export const updateApSettingSchema = createInsertSchema(ap_setting).omit({ id: true, created_by: true, created_at: true });

export type ApSetting = InferSelectModel<typeof ap_setting>;
export type NewApSetting = z.infer<typeof insertApSettingSchema>;
export type UpdateApSetting = z.infer<typeof updateApSettingSchema>;
