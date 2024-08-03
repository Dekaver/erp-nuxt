import { pgTable, serial, numeric, varchar, date, integer, char } from "drizzle-orm/pg-core";
import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { account } from "../account/schema";
import { kontak } from "../kontak/schema";
import { timestamps } from "../schema";

export const payment_ar = pgTable("payment_ar", {
    id: serial("id").primaryKey().notNull(),
    number: varchar("number", { length: 30 }).notNull(),
    date: date("date", { mode: "string" }).notNull(),
    id_customer: integer("id_customer")
        .notNull()
        .references(() => kontak.id),
    status: char("status", { length: 1 }).notNull(),
    other_cost: numeric("other_cost").default("0").notNull(),
    total: numeric("total").default("0").notNull(),
    bank_account: integer("bank_account")
        .notNull()
        .references(() => account.id),
    description: varchar("description"),
    ...timestamps,
});

export const insertPaymentArSchema = createInsertSchema(payment_ar);
export const updatePaymentArSchema = createInsertSchema(payment_ar).omit({ id: true, created_by: true, updated_by: true });

export type PaymentAr = InferSelectModel<typeof payment_ar>;
export type NewPaymentAr = z.infer<typeof insertPaymentArSchema>;
export type UpdatePaymentAr = z.infer<typeof updatePaymentArSchema>;

export const PaymentArColumns = getTableColumns(payment_ar);
