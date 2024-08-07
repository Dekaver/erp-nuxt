import { serial, integer, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { ptkp } from "../ptkp/schema";
import { ter } from "../ter/schema";

export const ptkpTer = pgTable("ter_ptkp", {
    id: serial("id").primaryKey().notNull(),
    id_ter: integer("id_ter")
        .notNull()
        .references(() => ter.id),
    id_ptkp: integer("id_ptkp")
        .notNull()
        .references(() => ptkp.id)
});

export const insertPtkpTerSchema = createInsertSchema(ptkpTer);

export type PtkpTer = InferSelectModel<typeof ptkpTer>;
export type NewPtkpTer = z.infer<typeof insertPtkpTerSchema>;

export const ptkpTerColumns = getTableColumns(ptkpTer);
