import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { boolean, char, date, integer, numeric, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../schema";
import { account } from "../account/schema";

export const stok_opname = pgTable("stok_opname", {
    id: serial("id").primaryKey().notNull(),
    id_gudang: integer("id_gudang"),
    id_account: integer("id_account").references(() => account.id),
    nomor: varchar("nomor", { length: 30 }),
    tanggal: date("tanggal", { mode: "string" }),
    keterangan: varchar("keterangan", { length: 100 }),
    status: char("status", { length: 1 }).notNull(),
    upload_by: integer("upload_by"),
    upload_at: timestamp("upload_at", { mode: "string" }),
    approved_by: integer("approved_by"),
    approved_at: timestamp("approved_at", { mode: "string" }),
    is_upload: boolean("is_upload").default(true).notNull(),
    qty_upload: integer("qty_upload").default(0).notNull(),
    ...timestamps,
});

export const insertStokOpnameSchema = createInsertSchema(stok_opname);
export const updateStokOpnameSchema = createInsertSchema(stok_opname).omit({id: true, created_by: true, updated_by: true});

export type StokOpname = InferSelectModel<typeof stok_opname>;
export type NewStokOpname = z.infer<typeof insertStokOpnameSchema>;
export type UpdateStokOpname = z.infer<typeof updateStokOpnameSchema>;

export const stokOpnameColumns = getTableColumns(stok_opname)
