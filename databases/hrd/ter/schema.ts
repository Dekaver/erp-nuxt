import { varchar, serial, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { timestamps } from "../../schema";

export const ter = pgTable("ter", {
    id: serial("id").primaryKey().notNull(),
    ter: varchar("ter", { length: 30 }).notNull(),
    ...timestamps,
});

export const insertTerSchema = createInsertSchema(ter);

export type Ter = InferSelectModel<typeof ter>;
export type NewTer = z.infer<typeof insertTerSchema>;

export const terColumns = getTableColumns(ter);
