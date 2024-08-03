import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { AnyPgColumn, char, date, integer, jsonb, numeric, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { gudang } from "../gudang/schema";
import { kontak } from "../kontak/schema";
import { timestamps } from "../schema";
import { top } from "../top/schema";

export const quotation = pgTable("quotation", {
    id: serial("id").notNull().primaryKey(),
    revisi: integer("revisi").references((): AnyPgColumn => quotation.id, { onDelete: "set null" }),
    nomor: varchar("nomor").notNull(),
    tanggal: date("tanggal").notNull(),
    id_customer: integer("id_customer")
        .notNull()
        .references(() => kontak.id),
    id_top: integer("id_top")
        .notNull()
        .references(() => top.id),
    kepada: varchar("kepada", { length: 100 }),
    keterangan: varchar("keterangan", { length: 100 }),
    total: numeric("total"),
    total_discount: numeric("total_discount"),
    diskonpersen: numeric("diskonpersen"),
    dpp: numeric("dpp"),
    pajak: jsonb("pajak"),
    grandtotal: numeric("grandtotal"),
    id_salesman: integer("id_salesman").notNull(),
    id_gudang: integer("id_gudang").references(() => gudang.id),
    telepon: varchar("telepon"),
    hp: varchar("hp", { length: 20 }),
    email: varchar("email", { length: 100 }),
    syarat: text("syarat"),
    top: integer("top"),
    id_kantor: integer("id_kantor"),
    deliverypoint: text("deliverypoint"),
    status: char("status", { length: 1 }), // D: DRAFT, S: SEND, O: OPEN
    ...timestamps
});

export const insertQuotationSchema = createInsertSchema(quotation);
export const updateQuotationSchema = createInsertSchema(quotation).omit({id: true, created_by: true, created_at: true});

export type Quotation = InferSelectModel<typeof quotation>;
export type NewQuotation = z.infer<typeof insertQuotationSchema>;
export type UpdateQuotation = z.infer<typeof updateQuotationSchema>;

export const QuotationColumns = getTableColumns(quotation);