import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { char, date, integer, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../schema";
import { proyek } from "../proyek/schema";

export const rencana_anggaran_biaya = pgTable("rencana_anggaran_biaya", {
    id: serial("id").primaryKey().notNull(),
    nomor: varchar("nomor").notNull(),
    tanggal: date("tanggal", { mode: "string" }).notNull(),
    total: numeric("total").notNull(),
    id_proyek: integer("id_proyek")
        .notNull()
        .references(() => proyek.id),
    status: char("status", { length: 1 }).notNull(),
    ...timestamps,
});

export const insertRencanaAnggaranBiayaSchema = createInsertSchema(rencana_anggaran_biaya);
export const updateRencanaAnggaranBiayaSchema = createInsertSchema(rencana_anggaran_biaya).omit({ id: true, created_by: true, created_at: true });

export type RencanaAnggaranBiaya = InferSelectModel<typeof rencana_anggaran_biaya>;
export type NewRencanaAnggaranBiaya = z.infer<typeof insertRencanaAnggaranBiayaSchema>;
export type UpdateRencanaAnggaranBiaya = z.infer<typeof updateRencanaAnggaranBiayaSchema>;

export const RencanaAnggaranBiayaColumns = getTableColumns(rencana_anggaran_biaya);
