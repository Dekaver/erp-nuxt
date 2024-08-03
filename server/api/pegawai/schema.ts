import { InferSelectModel, getTableColumns, relations } from 'drizzle-orm';
import { AnyPgColumn, boolean, date, integer, numeric, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const pegawai = pgTable('pegawai', {
    id: serial('id').primaryKey().notNull(),
    nama: varchar('nama', { length: 256 }).notNull(),
    hp: varchar('hp', { length: 256 }),
    hp2: varchar('hp2', { length: 256 }),
    hp3: varchar('hp3', { length: 256 }),
    email: varchar('email', { length: 256 }),
    wa: varchar('wa'),
    status: boolean('status'),
    nama_panggilan: varchar('nama_panggilan', { length: 256 }),
    tempat_lahir: varchar('tempat_lahir', { length: 100 }),
    tanggal_lahir: date('tanggal_lahir', { mode: 'string' }),
    jenis_kelamin: varchar('jenis_kelamin', { length: 1 }),
    status_pernikahan: varchar('status_pernikahan', { length: 20 }),
    golongan_darah: varchar('golongan_darah', { length: 2 }),
    nik_ktp: varchar('nik_ktp', { length: 25 }).notNull(),
    alamat_ktp: text('alamat_ktp'),
    kodepos_ktp: numeric('kodepos_ktp'),
    provinsi_ktp: integer('provinsi_ktp'),
    kabupaten_ktp: integer('kabupaten_ktp'),
    kecamatan_ktp: integer('kecamatan_ktp'),
    alamat_sama: boolean('alamat_sama'),
    alamat_domisili: text('alamat_domisili'),
    kodepos_domisili: numeric('kodepos_domisili'),
    provinsi_domisili: integer('provinsi_domisili'),
    kabupaten_domisili: integer('kabupaten_domisili'),
    kecamatan_domisili: integer('kecamatan_domisili'),
    id_agama: integer('id_agama'),
    tinggi_badan: numeric('tinggi_badan').default('0'),
    berat_badan: numeric('berat_badan').default('0'),
    anak_ke: varchar('anak_ke', { length: 10 }),
    nip: varchar('nip').notNull(),
    mulai_bekerja: date('mulai_bekerja'),
    pkwt: date('pkwt'),
    is_hd: boolean('is_hd'),
    absen: integer('absen'),
    status_karyawan: varchar('status_karyawan'),
    nomor_rekening: varchar('nomor_rekening'),
    fotonya: varchar('fotonya', { length: 256 }),
    aktifasi_umt: date('aktifasi_umt'),
    aktifasi_kehadiran: date('aktifasi_kehadiran'),
    is_new: boolean('is_new'),
    pemilik_rekening: varchar('pemilik_rekening', { length: 256 }),
    is_driver: boolean('is_driver'),
    id_kantor: integer('id_kantor').notNull(),
    id_departemen: integer('id_departemen'),
    id_jabatan: integer('id_jabatan'),
    id_site: integer('id_site'),
    id_level: integer('id_level'),
    atasan_langsung: integer('atasan_langsung').references((): AnyPgColumn => pegawai.id, { onDelete: 'set null' }),
    ttd: varchar('ttd', { length: 256 }),
    jabatan_penawaran: varchar('jabatan_penawaran', { length: 256 }),

    created_by: integer('created_by')
        .notNull()
        .references((): AnyPgColumn => pegawai.id),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updated_by: integer('updated_by')
        .notNull()
        .references((): AnyPgColumn => pegawai.id),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow(),
    deleted_by: integer('deleted_by').references((): AnyPgColumn => pegawai.id),
    deleted_at: timestamp('deleted_at', { mode: 'string' }),
    deleted_reason: text('deleted_reason').default('-').notNull(),
});

export const insertPegawaiSchema = createInsertSchema(pegawai);
export const updatePegawaiSchema = createInsertSchema(pegawai).omit({ id: true, created_by: true, created_at: true });

export type Pegawai = InferSelectModel<typeof pegawai>;
export type NewPegawai = z.infer<typeof insertPegawaiSchema>;
export type UpdatePegawai = z.infer<typeof updatePegawaiSchema>;

export const PegawaiColumns = getTableColumns(pegawai);
