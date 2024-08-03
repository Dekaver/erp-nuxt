import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { boolean, char, date, integer, pgTable, serial, time, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jadwalKerja = pgTable("jadwal_kerja", {
    id: serial("id").primaryKey().notNull(),
    nama_kebijakan: varchar("nama_kebijakan", { length: 100 }).notNull(),
    batas_terlambat: integer("batas_terlambat").notNull().default(0),
    batas_pulang: integer("batas_pulang").notNull().default(0),
    cycle: integer("cycle").notNull(),
    jenis: char("jenis", { length: 1 }).notNull(),
    start_date: date("start_date").notNull(),
    jmlkerja: integer("jmlkerja").notNull().default(0),
    absen: integer("absen"),
});

export const insertJadwalKerjaSchema = createInsertSchema(jadwalKerja);

export type JadwalKerja = InferSelectModel<typeof jadwalKerja>;
export type NewJadwalKerja = z.infer<typeof insertJadwalKerjaSchema>;
export const JadwalKerjaColumns = getTableColumns(jadwalKerja);

export const jadwalKerjaKaryawan = pgTable("jadwal_kerja_karyawan", {
    id_jadwal_kerja: integer("id_jadwal_kerja").notNull(),
    id_pegawai: integer("id_pegawai").notNull(),
});

export const insertJadwalKerjaKaryawanSchema = createInsertSchema(jadwalKerjaKaryawan);

export type JadwalKerjaKaryawan = InferSelectModel<typeof jadwalKerjaKaryawan>;
export type NewJadwalKerjaKaryawan = z.infer<typeof insertJadwalKerjaKaryawanSchema>;
export const JadwalKerjaKaryawanColumns = getTableColumns(jadwalKerjaKaryawan);

export const jadwalKerjaWaktu = pgTable("jadwal_kerja_waktu", {
    id_jadwal_kerja: integer("id_jadwal_kerja").notNull(),
    day: integer("day").notNull(),
    nama_waktu: varchar("nama_waktu", { length: 25 }).notNull(),
    selected: boolean("selected").notNull(),
    time_break: time("time_break"),
    time_in: time("time_in"),
    time_out: time("time_out"),
});

export const insertJadwalKerjaWaktuSchema = createInsertSchema(jadwalKerjaWaktu);

export type JadwalKerjaWaktu = InferSelectModel<typeof jadwalKerjaWaktu>;
export type NewJadwalKerjaWaktu = z.infer<typeof insertJadwalKerjaWaktuSchema>;
export const JadwalKerjaWaktuColumns = getTableColumns(jadwalKerjaWaktu);
