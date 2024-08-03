import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../../../schema";

export const hari_libur_tipe = pgTable("hari_libur_tipe", {
    id: serial("id").primaryKey(),
    tipe: varchar("tipe").notNull(),
    ...timestamps
});

export const insertHariLiburTipeSchema = createInsertSchema(hari_libur_tipe);
export const updateHariLiburTipeSchema = createInsertSchema(hari_libur_tipe).omit({created_by: true, created_at: true});

export type HariLiburTipe = InferSelectModel<typeof hari_libur_tipe>;
export type NewHariLiburTipe = z.infer<typeof insertHariLiburTipeSchema>;
export type UpdateHariLiburTipe = z.infer<typeof updateHariLiburTipeSchema>;

export const hariLiburColumns = getTableColumns(hari_libur_tipe);
