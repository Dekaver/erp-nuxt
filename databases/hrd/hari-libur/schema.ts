import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../../schema";
import { hari_libur_tipe } from "./tipe/schema";

export const hari_libur = pgTable("hari_libur", {
    id: serial("id").primaryKey(),
    hari_libur_tipe_id: integer("hari_libur_tipe_id").references(() => hari_libur_tipe.id),
    nama: varchar("nama").notNull(),
    tanggal: date("tanggal").notNull(),
    ...timestamps,
});

export const insertHariLiburSchema = createInsertSchema(hari_libur);
export const updateHariLiburSchema = createInsertSchema(hari_libur).omit({ created_by: true, created_at: true });

export type HariLibur = InferSelectModel<typeof hari_libur>;
export type NewHariLibur = z.infer<typeof insertHariLiburSchema>;
export type UpdateHariLibur = z.infer<typeof updateHariLiburSchema>;

export const hariLiburColumns = getTableColumns(hari_libur);
