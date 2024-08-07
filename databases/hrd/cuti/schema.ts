import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { boolean, char, date, integer, numeric, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cuti = pgTable("cuti", {
    id: serial("id").primaryKey().notNull(),
    nama_cuti: varchar("nama_cuti", { length: 100 }).notNull(),
    batasan: boolean("batasan").notNull().default(true),
    saldo: numeric("saldo").default("0"),
    perbaharui: varchar("perbaharui", { length: 1 }),
    tgl_perbaharui: date("tgl_perbaharui"),
    mulai_menggunakan: varchar("mulai_menggunakan", { length: 1 }),
    persetujuan1: varchar("persetujuan1", { length: 1 }),
    jabatan_persetujuan1: integer("jabatan_persetujuan1"),
    persetujuan2: varchar("persetujuan2", { length: 1 }),
    jabatan_persetujuan2: integer("jabatan_persetujuan2"),
    jenis: varchar("jenis", { length: 1 }),
    master: integer("master").notNull(),
    status: boolean("status").notNull().default(false),
    persetujuan3: varchar("persetujuan3", { length: 1 }),
    jabatan_persetujuan3: integer("jabatan_persetujuan3"),
    jabatan_persetujuan4: integer("jabatan_persetujuan4"),
    all_employee: boolean("all_employee").notNull().default(true),
    persetujuan4: varchar("persetujuan4", { length: 1 }),
});

export const insertCutiSchema = createInsertSchema(cuti);

export type Cuti = InferSelectModel<typeof cuti>;
export type NewCuti = z.infer<typeof insertCutiSchema>;
export const CutiColumns = getTableColumns(cuti);

export const cutiEmployee = pgTable("cuti_karyawan", {
    id: serial("id").primaryKey().notNull(),
    waktu_cuti: char("waktu_cuti").notNull(),
    tanggal_awal: date("tanggal_awal").notNull(),
    jenis_awal: char("jenis_awal"),
    tanggal_akhir: date("tanggal_akhir"),
    jenis_akhir: char("jenis_akhir"),
    telpon: varchar("telpon"),
    alasan: varchar("alasan"),
    status: char("status"),
    create_by: integer("create_by"),
    create_date: timestamp("create_date"),
    id_cuti: integer("id_cuti").notNull(),
    id_cuti_sub: integer("id_cuti_sub"),
    id_pegawai: integer("id_pegawai").notNull(),
    keterangan_status: varchar("keterangan_status", { length: 100 }),
    note: varchar("note"),
    foto_bukti: text("foto_bukti"),
});

export const insertCutiEmployeeSchema = createInsertSchema(cutiEmployee);

export type CutiEmployee = InferSelectModel<typeof cutiEmployee>;
export type NewCutiEmployee = z.infer<typeof insertCutiEmployeeSchema>;
export const CutiEmployeeColumns = getTableColumns(cutiEmployee);

export const cutiMaster = pgTable("cuti_master", {
    id: serial("id").primaryKey().notNull(),
    nama_master: varchar("nama_master"),
});

export const insertCutiMasterSchema = createInsertSchema(cutiMaster);

export type CutiMaster = InferSelectModel<typeof cutiMaster>;
export type NewCutiMaster = z.infer<typeof insertCutiMasterSchema>;
export const CutiMasterColumns = getTableColumns(cutiMaster);

export const cutiSub = pgTable("cuti_sub", {
    id: serial("id").primaryKey().notNull(),
    id_cuti: integer("id_cuti").notNull(),
    nama_sub_cuti: varchar("nama_sub_cuti").notNull(),
    jumlahhari: integer("jumlahhari").notNull(),
});

export const insertCutiSubSchema = createInsertSchema(cutiSub);

export type CutiSub = InferSelectModel<typeof cutiSub>;
export type NewCutiSub = z.infer<typeof insertCutiSubSchema>;
export const CutiSubColumns = getTableColumns(cutiSub);

export const cutiApproval = pgTable("cuti_persetujuan", {
    id_cuti_karyawan: integer("id_cuti_karyawan").primaryKey().notNull(),
    id_pegawai: integer("id_pegawai").notNull(),
    urut: integer("urut").notNull().default(0),
    status: boolean("status"),
    tanggal_persetujuan: timestamp("tanggal_persetujuan"),
});

export const insertCutiApprovalSchema = createInsertSchema(cutiApproval);

export type CutiApproval = InferSelectModel<typeof cutiApproval>;
export type NewCutiApproval = z.infer<typeof insertCutiApprovalSchema>;
export const CutiApprovalColumns = getTableColumns(cutiApproval);

export const cutiJabatan = pgTable("cuti_jabatan", {
    id_cuti: integer("id_cuti").notNull(),
    id_jabatan: integer("id_jabatan").notNull(),
});

export const insertCutiJabatanSchema = createInsertSchema(cutiJabatan);

export type CutiJabatan = InferSelectModel<typeof cutiJabatan>;
export type NewCutiJabatan = z.infer<typeof insertCutiJabatanSchema>;
export const CutiJabatanColumns = getTableColumns(cutiJabatan);
