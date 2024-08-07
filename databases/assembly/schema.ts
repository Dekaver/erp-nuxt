import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { char, date, integer, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { barang } from "../barang/schema";
import { gudang } from "../gudang/schema";
import { timestamps } from "../schema";

export const assembly = pgTable("assembly", {
    id: serial("id").primaryKey().notNull(),
    nomor: varchar("nomor", { length: 30 }).notNull(),
    tanggal: date("tanggal").notNull(),
    id_barang: integer("id_barang")
        .notNull()
        .references(() => barang.id),
    id_gudang: integer("id_gudang")
        .notNull()
        .references(() => gudang.id),
    qty: numeric("qty"),
    total_material: numeric("total_material").notNull(),
    total_biaya: numeric("total_biaya").notNull(),
    biaya_tetap: numeric("biaya_tetap").notNull(),
    total_biaya_tetap: numeric("total_biaya_tetap").notNull(),
    grandtotal: numeric("grandtotal").notNull(),
    harga_satuan: numeric("harga_satuan").notNull(),
    status: char("status", { length: 1 }).notNull(),
    jenis: char("jenis", { length: 1 }).notNull(),
    ...timestamps,
});

export const insertAssemblySchema = createInsertSchema(assembly);
export const updateAssemblySchema = createInsertSchema(assembly).omit({ id: true, created_by: true, updated_by: true });

export type Assembly = InferSelectModel<typeof assembly>;
export type NewAssembly = z.infer<typeof insertAssemblySchema>;
export type UpdateAssembly = z.infer<typeof updateAssemblySchema>;

export const AssemblyColumns = getTableColumns(assembly);