import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { char, date, integer, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { account } from "../account/schema";
import { kontak } from "../kontak/schema";
import { timestamps } from "../schema";

export const payment_ap = pgTable("payment_ap", {
    id: serial("id").primaryKey().notNull(),
    number: varchar("number", { length: 30 }).notNull(),
    date: date("date", { mode: "string" }).notNull(),
    id_supplier: integer("id_supplier")
        .notNull()
        .references(() => kontak.id),
    bank_account: integer("bank_account").notNull().references(() => account.id),
    other_cost: numeric("other_cost").default("0").notNull(),
    total: numeric("total").notNull(),
    status: char("status", { length: 1 }).notNull(),
    description: varchar("description"),
    ...timestamps,
});

export const insertPaymentApSchema = createInsertSchema(payment_ap);
export const updatePaymentApSchema = createInsertSchema(payment_ap).omit({ id: true, created_by: true, created_at: true });

export type PaymentAp = InferSelectModel<typeof payment_ap>;
export type NewPaymentAp = z.infer<typeof insertPaymentApSchema>;
export type UpdatePaymentAp = z.infer<typeof updatePaymentApSchema>;

export const PaymentApColumns = getTableColumns(payment_ap);
