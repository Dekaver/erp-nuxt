import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { char, date, integer, jsonb, numeric, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { gudang } from "../gudang/schema";
import { kontak } from "../kontak/schema";
import { quotation } from "../quotation/schema";
import { timestamps } from "../schema";
import { top } from "../top/schema";

export const sales_order = pgTable("sales_order", {
    id: serial("id").primaryKey().notNull(),
    nomor: varchar("nomor", { length: 30 }).notNull().unique(),
    tanggal: date("tanggal"),
    id_customer: integer("id_customer")
        .notNull()
        .references(() => kontak.id),
    id_top: integer("id_top")
        .notNull()
        .references(() => top.id),
    kepada: varchar("kepada", { length: 100 }),
    keterangan: varchar("keterangan", { length: 100 }),
    subtotal: numeric("subtotal"),
    diskonpersen: numeric("diskonpersen"),
    total_discount: numeric("total_discount"),
    dpp: numeric("dpp"),
    pajak: jsonb("pajak"),
    grandtotal: numeric("grandtotal"),
    id_salesman: integer("id_salesman"),
    kode_mata_uang: varchar("kode_mata_uang", { length: 10 }),
    id_gudang: integer("id_gudang").references(() => gudang.id),
    telepon: varchar("telepon"),
    hp: varchar("hp"),
    email: varchar("email", { length: 100 }),
    deliverypoint: text("deliverypoint"),
    syarat: text("syarat"),
    top: integer("top").default(0),
    id_quotation: integer("id_quotation").references(() => quotation.id),
    referensi: varchar("referensi", { length: 100 }),
    tanggal_referensi: date("tanggal_referensi"),
    status: char("status", { length: 1 }),
    jenis: char("jenis", { length: 1 }),
    ...timestamps
});

export const insertSalesOrderSchema = createInsertSchema(sales_order);
export const updateSalesOrderSchema = createInsertSchema(sales_order).omit({id: true, created_by: true, created_at: true});

export type SalesOrder = InferSelectModel<typeof sales_order>;
export type NewSalesOrder = z.infer<typeof insertSalesOrderSchema>;
export type UpdateSalesOrder = z.infer<typeof updateSalesOrderSchema>;

export const SalesOrderColumns = getTableColumns(sales_order);