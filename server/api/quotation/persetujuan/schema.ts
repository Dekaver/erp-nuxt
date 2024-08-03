import { getTableColumns, InferSelectModel } from "drizzle-orm";
import { boolean, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { quotation } from "../schema";

export const quotation_persetujuan = pgTable(
    "quotation_persetujuan",
    {
        id: integer("id")
            .notNull()
            .references(() => quotation.id),
        id_pegawai: integer("id_pegawai").notNull(),
        urut: integer("urut").notNull(),
        status: boolean("status"),
        tanggal_persetujuan: timestamp("tanggal_persetujuan", { mode: "string" }),
        id_jabatan: integer("id_jabatan").default(0),
        keterangan: text("keterangan"),
    },
    (table) => {
        return {
            primaryKey: primaryKey({columns:[table.id, table.id_pegawai]}),
        };
    },
);

export const insertQuotationPersetujuanSchema = createInsertSchema(quotation_persetujuan);
export const updateQuotationPersetujuanSchema = createInsertSchema(quotation_persetujuan).omit({ id: true, urut: true, id_jabatan: true, id_pegawai: true });

export type QuotationPersetujuan = InferSelectModel<typeof quotation_persetujuan>;
export type NewQuotationPersetujuan = z.infer<typeof insertQuotationPersetujuanSchema>;

export const QuotationPersetujuanColumns = getTableColumns(quotation_persetujuan);
