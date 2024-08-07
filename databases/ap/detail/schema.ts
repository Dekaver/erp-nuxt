import { getTableColumns, InferSelectModel } from "drizzle-orm";
import { boolean, foreignKey, integer, numeric, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { account } from "../../account/schema";
import { satuan } from "../../barang/satuan/schema";
import { barang } from "../../barang/schema";
import { proyek } from "../../proyek/schema";
import { purchase_order_detail } from "../../purchase_order/detail/schema";
import { ap } from "../schema";

export const ap_detail = pgTable(
    "ap_detail",
    {
        id: integer("id")
            .notNull()
            .references(() => ap.id),
        id_pb: integer("id_pb"),
        id_po: integer("id_po"),
        id_barang: integer("id_barang").references(() => barang.id),
        id_proyek: integer("id_proyek").references(() => proyek.id),
        nama_barang: varchar("nama_barang").notNull(),
        id_satuan: integer("id_satuan")
            .notNull()
            .references(() => satuan.id),
        id_pajak: varchar("id_pajak"),
        urut: integer("urut").notNull(),
        urut_po: integer("urut_po"),
        persen_pajak: varchar("persen_pajak"),
        qty: numeric("qty", { precision: 10, scale: 3 }).notNull(),
        harga: numeric("harga", { precision: 15, scale: 2 }).notNull(),
        total: numeric("total", { precision: 15, scale: 2 }).notNull(),
        id_account: integer("id_account").references(() => account.id),
        diskonpersen: numeric("diskonpersen", { precision: 15, scale: 2 }),
        diskonrp: numeric("diskonrp", { precision: 15, scale: 2 }),
        is_manual: boolean("is_manual").notNull().default(false),
        keterangan: text("keterangan"),
    },
    (table) => {
        return {
            poDetailPkey: primaryKey({ columns: [table.urut, table.id] }),
            fk1: foreignKey({
                columns: [table.id_po, table.urut_po],
                foreignColumns: [purchase_order_detail.id, purchase_order_detail.urut],
            }),
        };
    },
);

export const insertApDetailSchema = createInsertSchema(ap_detail);

export type ApDetail = InferSelectModel<typeof ap_detail>;
export type NewApDetail = z.infer<typeof insertApDetailSchema>;

export const apDetailColumns = getTableColumns(ap_detail);
