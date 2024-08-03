import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { char, date, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { gudang } from '../gudang/schema';
import { internal_order } from '../internal_order/schema';
import { jenis_kendaraan } from '../jenis_kendaraan/schema';

export const internal_transfer = pgTable('internal_transfer', {
    id: serial('id').primaryKey().notNull(),
    id_internal_order: integer('id_internal_order').references(() => internal_order.id),
    nomor: varchar('nomor').notNull(),
    tanggal: date('tanggal', { mode: 'string' }).notNull(),
    id_pengirim: integer('id_pengirim').notNull(),
    id_penerima: integer('id_penerima'),
    id_gudang_asal: integer('id_gudang_asal')
        .notNull()
        .references(() => gudang.id),
    id_gudang_tujuan: integer('id_gudang_tujuan')
        .notNull()
        .references(() => gudang.id),
    id_jenis_kendaraan: integer('id_jenis_kendaraan').references(() => jenis_kendaraan.id),
    status: char('status', { length: 1 }).notNull(),
    status_terima: char('status_terima', { length: 1 }),
    tanggal_kirim: date('tanggal_kirim', { mode: 'string' }).notNull(),
    tanggal_terima: date('tanggal_terima', { mode: 'string' }),
    jam_kirim: varchar('jam_kirim'),
    jam_terima: varchar('jam_terima'),
    keterangan: varchar('keterangan'),
    telepon: varchar('telepon', { length: 15 }),
    nopol: varchar('nopol'),
    driver: varchar('driver'),
    transporter: varchar('transporter'),
    created_by: integer('created_by').notNull(),
    created_date: timestamp('created_date', { mode: 'string' }),
    modified_by: integer('modified_by'),
    modified_date: timestamp('modified_date', { mode: 'string' }).defaultNow(),
});

export const insertInternalTransferSchema = createInsertSchema(internal_transfer);

export type InternalTransfer = InferSelectModel<typeof internal_transfer>;
export type NewInternalTransfer = z.infer<typeof insertInternalTransferSchema>;

export const InternalTransferColumns = getTableColumns(internal_transfer);
