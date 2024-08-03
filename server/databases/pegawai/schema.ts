import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { AnyPgColumn, boolean, date, integer, numeric, pgSchema, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { agama } from "../agama/schema";
import { departemen } from "../departemen/schema";
import { jabatan } from "../jabatan/schema";
import { kantor } from "../kantor/schema";

const hr = pgSchema("hr");

export const pegawai = hr.table("pegawai", {
    id: serial("id").primaryKey().notNull(),
    nama: varchar("nama", { length: 256 }).notNull(),
    hp: varchar("hp", { length: 256 }),
    hp2: varchar("hp2", { length: 256 }),
    hp3: varchar("hp3", { length: 256 }),
    email: varchar("email", { length: 256 }),
    wa: varchar("wa", { length: 50 }),
    status: boolean("status"),
    nama_panggilan: varchar("nama_panggilan", { length: 256 }),
    tempat_lahir: varchar("tempat_lahir", { length: 100 }),
    tanggal_lahir: date("tanggal_lahir", { mode: "string" }),
    jenis_kelamin: varchar("jenis_kelamin", { length: 1 }),
    status_pernikahan: varchar("status_pernikahan", { length: 20 }),
    golongan_darah: varchar("golongan_darah", { length: 2 }),
    nik_ktp: varchar("nik_ktp", { length: 25 }),
    alamat_ktp: text("alamat_ktp"),
    kodepos_ktp: numeric("kodepos_ktp"),
    provinsi_ktp: integer("provinsi_ktp"),
    kabupaten_ktp: integer("kabupaten_ktp"),
    kecamatan_ktp: integer("kecamatan_ktp"),
    alamat_sama: boolean("alamat_sama"),
    alamat_domisili: text("alamat_domisili"),
    kodepos_domisili: numeric("kodepos_domisili"),
    provinsi_domisili: integer("provinsi_domisili"),
    kabupaten_domisili: integer("kabupaten_domisili"),
    kecamatan_domisili: integer("kecamatan_domisili"),
    id_agama: integer("id_agama").references(() => agama.id),
    tinggi_badan: numeric("tinggi_badan").default("0"),
    berat_badan: numeric("berat_badan").default("0"),
    anak_ke: varchar("anak_ke", { length: 10 }),
    nip: varchar("nip", { length: 50 }),
    mulai_bekerja: date("mulai_bekerja"),
    pkwt: date("pkwt"),
    is_hd: boolean("is_hd"),
    absen: integer("absen"),
    status_karyawan: varchar("status_karyawan"),
    nomor_rekening: varchar("nomor_rekening", { length: 50 }),
    fotonya: varchar("fotonya", { length: 256 }),
    aktifasi_umt: date("aktifasi_umt"),
    aktifasi_kehadiran: date("aktifasi_kehadiran"),
    is_new: boolean("is_new"),
    pemilik_rekening: varchar("pemilik_rekening", { length: 256 }),
    is_driver: boolean("is_driver"),
    id_kantor: integer("id_kantor").references(() => kantor.id),
    id_departemen: integer("id_departemen").references(() => departemen.id),
    id_jabatan: integer("id_jabatan").references(() => jabatan.id),
    id_site: integer("id_site"),
    id_level: integer("id_level"),
    atasan_langsung: integer("atasan_langsung").references((): AnyPgColumn => pegawai.id, { onDelete: "set null" }),
    ttd: varchar("ttd", { length: 256 }),
    jabatan_penawaran: varchar("jabatan_penawaran", { length: 256 }),
});

export const insertPegawaiSchema = createInsertSchema(pegawai);

export type Pegawai = InferSelectModel<typeof pegawai>;
export type NewPegawai = z.infer<typeof insertPegawaiSchema>;

export const pegawaiColumns = getTableColumns(pegawai);
