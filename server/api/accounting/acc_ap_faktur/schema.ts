import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { date, integer, numeric, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { kontak } from "../../kontak/schema";
import { timestamps } from "../../schema";
import { top } from "../../top/schema";

export const acc_ap_faktur = pgTable("acc_ap_faktur", {
    ap_number: varchar("ap_number", { length: 15 }).notNull().primaryKey(),
    date: date("date", { mode: "string" }).notNull(),
    id_supplier: integer("id_supplier")
        .notNull()
        .references(() => kontak.id),
    id_top: integer("id_top")
        .notNull()
        .references(() => top.id),
    invoice_number: varchar("invoice_number").notNull(),
    invoice_date: date("invoice_date").notNull(),
    top: integer("top").default(0).notNull(),
    due_date: date("due_date").notNull(),
    amount: numeric("amount").default("0").notNull(),
    discount: numeric("discount").default("0").notNull(),
    pay: numeric("pay").default("0").notNull(),
    ...timestamps
});

export const insertAccApFakturSchema = createInsertSchema(acc_ap_faktur);
export const updateAccApFakturSchema = createInsertSchema(acc_ap_faktur).omit({ ap_number: true, created_by: true, updated_by: true });

export type AccApFaktur = InferSelectModel<typeof acc_ap_faktur>;
export type NewAccApFaktur = z.infer<typeof insertAccApFakturSchema>;
export type UpdateAccApFaktur = z.infer<typeof updateAccApFakturSchema>;

export const AccApFakturColumns = getTableColumns(acc_ap_faktur);
