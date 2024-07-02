import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pengguna = pgTable("pengguna", {
    usernamenya: varchar("usernamenya", { length: 100 }).primaryKey().notNull(),
    passwordnya: varchar("passwordnya", { length: 100 }).notNull(),
    dibuat: timestamp("dibuat", { mode: "string" }).defaultNow(),
    loginterakhir: timestamp("loginterakhir", { mode: "string" }),
    enabled: boolean("enabled").default(true),
    jmlogin: integer("jmlogin").default(0),
    loginterbaru: timestamp("loginterbaru", { mode: "string" }),
    role: integer("role"),
    pinnya: varchar("pinnya", { length: 100 }),
    id_pegawai: integer("id_pegawai").notNull(),
});

export const insertPenggunaSchema = createInsertSchema(pengguna);
export const updatePenggunaSchema = createInsertSchema(pengguna, {
    passwordnya: z.string().optional(),
});

export type Pengguna = InferSelectModel<typeof pengguna>;
export type NewPengguna = z.infer<typeof insertPenggunaSchema>;
export type UpdatePengguna = z.infer<typeof updatePenggunaSchema>;

export const penggunaColumns = getTableColumns(pengguna)
