import { InferSelectModel } from "drizzle-orm";
import { pgSchema, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
const hr = pgSchema("hr");

export const departemen = hr.table("departemen", {
    id: serial("id").primaryKey().notNull(),
    departemen: varchar("departemen", { length: 255 }).notNull(),
    kode: varchar("kode", { length: 255 }).notNull(),
});

export const insertDepartemenSchema = createInsertSchema(departemen);

export type Departemen = InferSelectModel<typeof departemen>;
export type NewDepartemen = z.infer<typeof insertDepartemenSchema>;
