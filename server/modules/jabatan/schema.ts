import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { integer, pgSchema, boolean, serial, varchar, AnyPgColumn } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
const hr = pgSchema("hr");
export const jabatan = hr.table("jabatan", {
    id: serial("id").primaryKey(),
    jabatan: varchar("name", { length: 255 }).notNull(),
    is_head_departemen: boolean("is_head_departemen").default(false),
    atasan: integer("atasan").references((): AnyPgColumn => jabatan.id, { onDelete: "set null" }),
});

export const insertJabatanSchema = createInsertSchema(jabatan);

export type Jabatan = InferSelectModel<typeof jabatan>;
export type NewJabatan = z.infer<typeof insertJabatanSchema>;

export const jabatanColumns = getTableColumns(jabatan);
