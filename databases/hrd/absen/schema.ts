import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { date, integer, pgTable, text, time, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const absen = pgTable("absen", {
    tanggal: date("tanggal").notNull(),
    jam_masuk: time("jam_masuk"),
    jam_keluar: time("jam_keluar"),
    keterangan: varchar("keterangan"),
    catatan: text("catatan"),
    tipe_absen: varchar("tipe_absen", { length: 1 }),
    id_jadwal_kerja: integer("id_jadwal_kerja"),
    id_absen: integer("id_absen").notNull(),
    urut: integer("urut").notNull().default(0),
    overtimebefore: integer("overtimebefore").notNull().default(0),
    overtimeafter: integer("overtimeafter").notNull().default(0),
    id_cuti: integer("id_cuti"),
    id_status_absen: varchar("id_status_absen", { length: 5 }),
    time_break: time("time_break"),
    time_in: time("time_in"),
    time_out: time("time_out"),
    schedule: varchar("schedule", { length: 1 }),
    jam_break: time("jam_break"),
    foto_masuk: text("foto_masuk"),
    foto_keluar: text("foto_keluar"),
    id_absen_tempat: integer("id_absen_tempat"),
    coordinate_clock_in: varchar("coordinate_clock_in"),
    coordinate_clock_out: varchar("coordinate_clock_out"),
});

export const insertAbsenSchema = createInsertSchema(absen);

export type Absen = InferSelectModel<typeof absen>;
export type NewAbsen = z.infer<typeof insertAbsenSchema>;
export const AbsenColumns = getTableColumns(absen);
