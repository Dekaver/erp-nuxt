import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { integer, pgSchema, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { pegawai } from "../schema";

// Define the pegawai_kas table
const hr = pgSchema("hr");

export const pegawaiKas = hr.table(
    "pegawai_kas",
    {
        id_pegawai: integer("id_pegawai")
            .notNull()
            .references(() => pegawai.id),
        id_account: integer("id_account"),
        inisial: varchar("inisial").notNull(),
    },
    (table) => {
        return {
            soDetailPkey: primaryKey({ columns: [table.id_pegawai, table.id_account] }),
        };
    },
);

// Create an insert schema for the pegawai_kas table
export const insertPegawaiKasSchema = createInsertSchema(pegawaiKas);
export const updatePegawaiKasSchema = createInsertSchema(pegawaiKas).omit({ id_pegawai: true, id_account: true });

// Define types for PegawaiKas and NewPegawaiKas
export type PegawaiKas = InferSelectModel<typeof pegawaiKas>;
export type NewPegawaiKas = z.infer<typeof insertPegawaiKasSchema>;
export type UpdatePegawaiKas = z.infer<typeof updatePegawaiKasSchema>;

// Get columns for the pegawaiKas table
export const PegawaiKasColumns = getTableColumns(pegawaiKas);
