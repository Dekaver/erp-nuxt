import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const typeEnum = pgEnum("type", ["string", "boolean", "integer", "float"]);

export const setting = pgTable("setting", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    value: varchar("value").notNull(),
    type: typeEnum("type"),
});

export const insertSettingSchema = createInsertSchema(setting);
export const updateSettingSchema = createInsertSchema(setting).omit({ id: true });

export type Setting = InferSelectModel<typeof setting>;
export type NewSetting = z.infer<typeof insertSettingSchema>;
export type UpdateSetting = z.infer<typeof updateSettingSchema>;

export const SettingColumns = getTableColumns(setting);
