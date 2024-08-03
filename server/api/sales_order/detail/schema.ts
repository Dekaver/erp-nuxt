import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { integer, numeric, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { barang } from "../../barang/schema";
import { proyek } from "../../proyek/schema";
import { sales_order } from "../schema";
import { satuan } from "../../barang/satuan/schema";

export const sales_order_detail = pgTable(
    "sales_order_detail",
    {
        id: integer("id")
            .notNull()
            .references(() => sales_order.id),
        urut: integer("urut").notNull(),
        id_barang: integer("id_barang").references(() => barang.id),
        nama_barang: varchar("nama_barang").notNull(),
        remark: varchar("remark"),
        qty: numeric("qty"),
        id_satuan: integer("id_satuan").references(() => satuan.id),
        harga: numeric("harga"),
        total: numeric("total"),
        diskonrp: numeric("diskonrp"),
        diskonpersen: numeric("diskonpersen"),
        diambil: numeric("diambil").notNull(),
        sisa: numeric("sisa").notNull(),
        id_pajak: varchar("id_pajak", { length: 100 }),
        persen_pajak: varchar("persen_pajak", { length: 100 }),
        id_proyek: integer("id_proyek").references(() => proyek.id),
        note: text("note"),
    },
    (table) => {
        return {
            soDetailPkey: primaryKey({columns: [table.id, table.urut]}),
        };
    },
);

export const insertSalesOrderDetailSchema = createInsertSchema(sales_order_detail);

export type SalesOrderDetail = InferSelectModel<typeof sales_order_detail>;
export type NewSalesOrderDetail = z.infer<typeof insertSalesOrderDetailSchema>;

export const SalesOrderDetailColumns = getTableColumns(sales_order_detail);
