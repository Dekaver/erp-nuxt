import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const absenPeriode = pgTable("absen_periode", {
    year: varchar("year", { length: 4 }).notNull(),
    month: integer("month").notNull(),
    start: date("start").notNull(),
    end_date: date("end_date").notNull(),
});

export const insertAbsenPeriodeSchema = createInsertSchema(absenPeriode);

export type AbsenPeriode = InferSelectModel<typeof absenPeriode>;
export type NewAbsenPeriode = z.infer<typeof insertAbsenPeriodeSchema>;
export const AbsenPeriodeColumns = getTableColumns(absenPeriode);
