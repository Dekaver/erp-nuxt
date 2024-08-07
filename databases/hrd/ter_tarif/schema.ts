import { serial, numeric, integer, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { timestamps } from "../../schema";
import { ter } from "../ter/schema";

export const terTarif = pgTable("ter_tarif", {
    id: serial("id").primaryKey().notNull(),
    id_ter: integer("id_ter")
        .notNull()
        .references(() => ter.id),
    batas_atas: numeric("batas_atas").default("0"),
    batas_bawah: numeric("batas_bawah").default("0"),
    tarif: numeric("tarif").default("0"),
    ...timestamps,
});

export const insertTerTarifSchema = createInsertSchema(terTarif);

export type TerTarif = InferSelectModel<typeof terTarif>;
export type NewTerTarif = z.infer<typeof insertTerTarifSchema>;

export const terTarifColumns = getTableColumns(terTarif);
