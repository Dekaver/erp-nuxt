import { pgTable, integer, varchar, serial, text, boolean, numeric } from "drizzle-orm/pg-core";
import { account } from "../account/schema";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { top } from "../top/schema";

export const kontak = pgTable("kontak", {
    id: serial("id").primaryKey().notNull(),
    id_top: integer("id_top")
        .notNull()
        .references(() => top.id),
    inisial: varchar("inisial", { length: 10 }).notNull(),
    kontak: varchar("kontak", { length: 100 }).notNull(),
    npwp: varchar("npwp", { length: 30 }),
    alamat_npwp: varchar("alamat_npwp", { length: 200 }),
    telepon: varchar("telepon"),
    email: varchar("email"),
    alamat_penagihan: text("alamat_penagihan"),
    id_kategori: integer("id_kategori").references(() => kategoriKontak.id),
    nama_bank: text("nama_bank"),
    no_rekening: varchar("no_rekening", { length: 25 }),
    pemegang_rekening: varchar("pemegang_rekening"),
    is_aktif: boolean("is_aktif").default(true).notNull(),
    batasKredit: numeric("batas_kredit").default("0"),
    website: varchar("website"),
    alamat_kirim: varchar("alamat_kirim", { length: 300 }),
    kode: varchar("kode", { length: 10 }).notNull(),
    hp: varchar("hp"),
    attention: varchar("attention"),
    hp_attention: varchar("hp_attention"),
    akun_hutang: integer("akun_hutang").references(() => account.id),
    akun_piutang: integer("akun_piutang").references(() => account.id),
    is_customer: boolean("is_customer").default(true).notNull(),
    is_supplier: boolean("is_supplier").default(true).notNull(),
});

export const insertKontakSchema = createInsertSchema(kontak);

export type Kontak = InferSelectModel<typeof kontak>;
export type NewKontak = z.infer<typeof insertKontakSchema>;

export const kontakColumns = getTableColumns(kontak)

export const kategoriKontak = pgTable("kategori_kontak", {
    id: serial("id").primaryKey().notNull(),
    kategori: varchar("kategori").notNull(),
});

export const insertKategoriKontakSchema = createInsertSchema(kategoriKontak);

export type KategoriKontak = InferSelectModel<typeof kategoriKontak>;
export type NewKategoriKontak = z.infer<typeof insertKategoriKontakSchema>;
