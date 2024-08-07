import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { char, date, integer, numeric, pgTable, primaryKey, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { kontak } from "../kontak/schema";

export const acc_proposal_ap = pgTable("acc_proposal_ap", {
    id: serial("id").primaryKey().notNull(),
    nomor: varchar("nomor", { length: 30 }).notNull(),
    tanggal: date("tanggal", { mode: "string" }).defaultNow().notNull(),
    keterangan: text("keterangan"),
    status: char("status", { length: 1 }).notNull(),
});

export const insertAccProposalApSchema = createInsertSchema(acc_proposal_ap);

export type AccProposalAp = InferSelectModel<typeof acc_proposal_ap>;
export type NewAccProposalAp = z.infer<typeof insertAccProposalApSchema>;

export const AccProposalApColumns = getTableColumns(acc_proposal_ap);