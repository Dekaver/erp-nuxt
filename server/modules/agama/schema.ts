import { InferSelectModel } from "drizzle-orm";
import { pgSchema, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// import { hr } from "../schema";
export const hr = pgSchema("hr");

export const agama = hr.table("agama", {
    id: serial("id").primaryKey().notNull(),
    agama: varchar("agama", { length: 25 }).notNull(),
});

export const insertAgamaSchema = createInsertSchema(agama);

export type Agama = InferSelectModel<typeof agama>;
export type NewAgama = z.infer<typeof insertAgamaSchema>;
