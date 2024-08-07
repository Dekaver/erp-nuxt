import { getTableColumns, InferSelectModel } from "drizzle-orm";
import { boolean, char, date, integer, json, numeric, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { gudang } from "../gudang/schema";
import { kontak } from "../kontak/schema";
import { timestamps } from "../schema";
import { top } from "../top/schema";
import { uang_muka } from "../uang_muka/schema";

export const ap = pgTable("ap", {
    id: serial("id").primaryKey(),
    nomor: varchar("nomor", { length: 30 }).notNull().unique(),
    tanggal: date("tanggal", { mode: "string" }).defaultNow().notNull(),
    id_supplier: integer("id_supplier")
        .notNull()
        .references(() => kontak.id),
    id_gudang: integer("id_gudang")
        .notNull()
        .references(() => gudang.id),
    id_top: integer("id_top")
        .notNull()
        .references(() => top.id),
    referensi: varchar("referensi", { length: 30 }),
    tanggal_referensi: date("tanggal_referensi", { mode: "string" }),
    tanggal_pengiriman: date("tanggal_pengiriman", { mode: "string" }), // TODO: Gak Tau kenapa di vue ja jadi tanggal penerimaan barang
    tanggal_jatuh_tempo: date("tanggal_jatuh_tempo", { mode: "string" }).notNull(),
    keterangan: varchar("keterangan"),
    total: numeric("total").default("0").notNull(),
    total_pajak: numeric("total_pajak").default("0"),
    grandtotal: numeric("grandtotal").default("0").notNull(),
    status: char("status", { length: 1 }).notNull(), // D: DRAFT, S: SEND, C: CLOSED
    total_discount: varchar("total_discount"),
    persendiskon: numeric("persendiskon").default("0"),
    id_kantor: integer("id_kantor"),
    no_faktur_pajak: varchar("no_faktur_pajak", { length: 30 }),
    id_pp: integer("id_pp"),
    id_po: integer("id_po"),
    is_lunas: boolean("is_lunas"),
    top: integer("top").notNull(),
    id_uang_muka: integer("id_uang_muka").references(() => uang_muka.id),
    // Optional
    biaya_transportasi: numeric("biaya_transportasi").default("0").notNull(),
    biaya_asuransi: numeric("biaya_asuransi").default("0").notNull(),
    biaya_bongkar_muat: numeric("biaya_bongkar_muat").default("0").notNull(),
    biaya_bongkar_muat_external: numeric("biaya_bongkar_muat_external").default("0").notNull(),
    biaya_lain: numeric("biaya_lain").default("0").notNull(),
    pajak: json("pajak"),
    ...timestamps,
});

export const insertApSchema = createInsertSchema(ap);
export const updateApSchema = createInsertSchema(ap).omit({ id: true, created_by: true, created_at: true });

export type Ap = InferSelectModel<typeof ap>;
export type NewAp = z.infer<typeof insertApSchema>;
export type UpdateAp = z.infer<typeof updateApSchema>;

export const apColumns = getTableColumns(ap);