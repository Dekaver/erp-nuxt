import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { doublePrecision, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const absenTempat = pgTable("absen_tempat", {
    id: serial("id").primaryKey().notNull(),
    nama: varchar("nama", { length: 100 }).notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    jarak_absen: integer("jarak_absen").notNull(),
});

export const insertAbsenTempatSchema = createInsertSchema(absenTempat);

export type AbsenTempat = InferSelectModel<typeof absenTempat>;
export type NewAbsenTempat = z.infer<typeof insertAbsenTempatSchema>;
export const AbsenTempatColumns = getTableColumns(absenTempat);
