import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { boolean, char, date, integer, numeric, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../../schema';

export const lemburMaster = pgTable('lembur_master', {
    id: serial('id').primaryKey().notNull(),
    nama: varchar('nama').notNull(),
    kebijakan: boolean('kebijakan').notNull(),
    persetujuan1: varchar('persetujuan1', { length: 1 }).notNull(),
    persetujuan2: varchar('persetujuan2', { length: 1 }).notNull(),
    jabatan_persetujuan1: integer('jabatan_persetujuan1'),
    jabatan_persetujuan2: integer('jabatan_persetujuan2'),
    biaya: numeric('biaya').notNull(),
    persetujuan3: varchar('persetujuan3', { length: 1 }),
    persetujuan4: varchar('persetujuan4', { length: 1 }),
    jabatan_persetujuan3: integer('jabatan_persetujuan3'),
    jabatan_persetujuan4: integer('jabatan_persetujuan4'),
    ...timestamps,
});

export const insertLemburMasterSchema = createInsertSchema(lemburMaster);

export type LemburMaster = InferSelectModel<typeof lemburMaster>;
export type NewLemburMaster = z.infer<typeof insertLemburMasterSchema>;
export const LemburMasterColumns = getTableColumns(lemburMaster);

export const lembur = pgTable('lembur', {
    id: serial('id').primaryKey().notNull(),
    tanggal: date('tanggal').notNull(),
    id_pegawai: integer('id_pegawai').notNull(),
    hour_before: integer('hour_before').notNull().default(0),
    minutes_before: integer('minutes_before').notNull().default(0),
    hour_after: integer('hour_after').notNull().default(0),
    minutes_after: integer('minutes_after').notNull().default(0),
    keterangan: varchar('keterangan'),
    status: char('status', { length: 1 }).notNull(),
    keterangan_status: varchar('keterangan_status', { length: 100 }).notNull(),
    id_lembur: integer('id_lembur').notNull(),
    create_by: integer('create_by'),
    create_date: timestamp('create_date').defaultNow(),
    break_time: integer('break_time').default(0),
    nomor: varchar('nomor', { length: 25 }),
    revisi: integer('revisi').notNull().default(0),
});

export const insertLemburSchema = createInsertSchema(lembur);

export type Lembur = InferSelectModel<typeof lembur>;
export type NewLembur = z.infer<typeof insertLemburSchema>;
export const LemburColumns = getTableColumns(lembur);

export const lemburPersetujuan = pgTable('lembur_persetujuan', {
    id_lembur_karyawan: integer('id_lembur_karyawan')
        .primaryKey()
        .references(() => lembur.id)
        .notNull(),
    id_pegawai: integer('id_pegawai').notNull(),
    urut: integer('urut').default(0).notNull(),
    status: boolean('status'),
    tanggal_persetujuan: timestamp('tanggal_persetujuan'),
    revisi: integer('revisi').notNull(),
});

export const insertLemburPersetujuanSchema = createInsertSchema(lemburPersetujuan);

export type LemburPersetujuan = InferSelectModel<typeof lemburPersetujuan>;
export type NewLemburPersetujuan = z.infer<typeof insertLemburPersetujuanSchema>;
export const LemburPersetujuanColumns = getTableColumns(lemburPersetujuan);

export const lemburMultiplier = pgTable('lembur_multiplier', {
    id_lembur: integer('id_lembur').notNull(),
    jenis: varchar('jenis', { length: 1 }).notNull(),
    urut: integer('urut').notNull(),
    mulai: integer('mulai').notNull(),
    selesai: integer('selesai').notNull(),
    multiply: numeric('multiply').notNull(),
});

export const insertLemburMultiplierSchema = createInsertSchema(lemburMultiplier);

export type LemburMultiplier = InferSelectModel<typeof lemburMultiplier>;
export type NewLemburMultiplier = z.infer<typeof insertLemburMultiplierSchema>;
export const LemburMultiplierColumns = getTableColumns(lemburMultiplier);

export const lemburKaryawan = pgTable('lembur_karyawan', {
    id_lembur: integer('id_lembur').notNull(),
    id_pegawai: integer('id_pegawai').notNull(),
});

export const insertLemburKaryawanSchema = createInsertSchema(lemburKaryawan);

export type LemburKaryawan = InferSelectModel<typeof lemburKaryawan>;
export type NewLemburKaryawan = z.infer<typeof insertLemburKaryawanSchema>;
export const LemburKaryawanColumns = getTableColumns(lemburKaryawan);
