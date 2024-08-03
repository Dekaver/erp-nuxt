import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { boolean, date, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../../schema";

export const acc_gl_trans = pgTable("acc_gl_trans", {
    gl_number: varchar("gl_number", { length: 11 }).primaryKey().notNull(),
    gl_date: date("gl_date").notNull(),
    reference: varchar("reference").notNull().unique(),
    total: numeric("total").default("0"),
    note: text("note"),
    is_posting: boolean("is_posting").default(false).notNull(),
    journal_code: varchar("journal_code", { length: 3 }),
    ...timestamps
});

export const insertAccGlTransSchema = createInsertSchema(acc_gl_trans);

export type AccGlTrans = InferSelectModel<typeof acc_gl_trans>;
export type NewAccGlTrans = z.infer<typeof insertAccGlTransSchema>;

export const accGLTransColumns = getTableColumns(acc_gl_trans);
