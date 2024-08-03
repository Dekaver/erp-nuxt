import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { pgTable, serial, varchar, integer, text, pgSchema } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// import { hr } from "../schema";

const hr = pgSchema("hr");

export const kantor = hr.table("kantor", {
    id: serial("id").primaryKey().notNull(),
    numbercode: varchar("numbercode", { length: 25 }),
    nama: varchar("nama", { length: 25 }).notNull(),
    telepon: varchar("telepon", { length: 15 }),
    email: varchar("email", { length: 30 }),
    alamat: text("alamat"),
    account_penjualan: integer("account_penjualan"),
    account_piutang: integer("account_piutang"),
    account_hutang: integer("account_hutang"),
});

export const insertKantorSchema = createInsertSchema(kantor);

export type Kantor = InferSelectModel<typeof kantor>;
export type NewKantor = z.infer<typeof insertKantorSchema>;
export const kantorColumns = getTableColumns(kantor);
