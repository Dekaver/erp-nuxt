import { boolean, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { ap } from "../schema";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { z } from "zod";

export const ap_persetujuan = pgTable(
    "ap_persetujuan",
    {
        id: integer("id")
            .notNull()
            .references(() => ap.id),
        id_pegawai: integer("id_pegawai").notNull(),
        urut: integer("urut").notNull(),
        status: boolean("status"),
        tanggal_persetujuan: timestamp("tanggal_persetujuan", { mode: "string" }),
        id_jabatan: integer("id_jabatan").default(0),
        keterangan: text("keterangan"),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.id_pegawai] }),
        };
    },
);

export const insertApPersetujuanSchema = createInsertSchema(ap_persetujuan);

export type ApPersetujuan = InferSelectModel<typeof ap_persetujuan>;
export type NewApPersetujuan = z.infer<typeof insertApPersetujuanSchema>;

export const apPersetujuanColumns = getTableColumns(ap_persetujuan)
