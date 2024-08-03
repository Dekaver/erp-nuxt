import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { char, date, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { gudang } from "../gudang/schema";
import { timestamps } from "../schema";

export const internal_order = pgTable("internal_order", {
    id: serial("id").primaryKey().notNull(),
    nomor: varchar("nomor", { length: 30 }).notNull(),
    tanggal: date("tanggal", { mode: "string" }).notNull(),
    id_gudang_asal: integer("id_gudang_asal").references(() => gudang.id),
    id_gudang_tujuan: integer("id_gudang_tujuan").references(() => gudang.id),
    status: char("status", { length: 1 }).notNull(),
    keterangan: varchar("keterangan"),

    send_by: integer("send_by"),
    send_date: timestamp("send_date", { mode: "string" }),
    ...timestamps,
});

export const insertInternalOrderSchema = createInsertSchema(internal_order);

export type InternalOrder = InferSelectModel<typeof internal_order>;
export type NewInternalOrder = z.infer<typeof insertInternalOrderSchema>;

export const InternalOrderColumns = getTableColumns(internal_order);
