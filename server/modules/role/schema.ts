import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const role = pgTable("role", {
    id: serial("id").primaryKey().notNull(),
    role: varchar("role", { length: 20 }).notNull(),
});

export const insertRoleSchema = createInsertSchema(role);

export type Role = InferSelectModel<typeof role>;
export type NewRole = z.infer<typeof insertRoleSchema>;

export const roleColumns = getTableColumns(role);
