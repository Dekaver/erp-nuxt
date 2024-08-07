import { getTableColumns, InferSelectModel } from "drizzle-orm";
import { integer, numeric, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { barang } from "../../barang/schema";
import { proyek } from "../../proyek/schema";
import { purchase_request } from "../schema";

export const purchase_request_detail = pgTable(
    "purchase_request_detail",
    {
        id: integer("id")
            .notNull()
            .references(() => purchase_request.id),
        urut: integer("urut").notNull(),
        id_barang: integer("id_barang").references(() => barang.id),
        id_satuan: integer("id_satuan").notNull(),
        id_pajak: varchar("id_pajak"),
        id_proyek: integer("id_proyek").references(() => proyek.id),
        nama_barang: varchar("nama_barang").notNull(),
        qty: numeric("qty").notNull(),
        diorder: numeric("diorder").notNull(),
        harga: numeric("harga").notNull(),
        total: numeric("total").notNull(),
        persen_pajak: varchar("persen_pajak"),
        diskonpersen: numeric("diskonpersen", { precision: 5, scale: 2 }),
        diskonrp: numeric("diskonrp"),
        keterangan: text("keterangan"),
    },
    (table) => {
        return {
            primaryKey: primaryKey({columns:[table.id, table.urut]}),
        };
    },
);

export const insertPurchaseRequestDetailSchema = createInsertSchema(purchase_request_detail);

export type PurchaseRequestDetail = InferSelectModel<typeof purchase_request_detail>;
export type NewPurchaseRequestDetail = z.infer<typeof insertPurchaseRequestDetailSchema>;

export const PurchaseRequestDetailColumns = getTableColumns(purchase_request_detail);
