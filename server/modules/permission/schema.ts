import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { AnyPgColumn, integer, pgTable, serial, smallint, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const permission = pgTable("permission", {
    id: serial("id").primaryKey().notNull(),
    parent: integer("parent").references((): AnyPgColumn => permission.id, { onUpdate: "cascade" }),
    permission: varchar("permission", { length: 50 }).notNull(),
    keterangan: varchar("keterangan", { length: 255 }),
    level: smallint("level").notNull(),
});

export const insertPermissionSchema = createInsertSchema(permission);

export type Permission = InferSelectModel<typeof permission>;
export type NewPermission = z.infer<typeof insertPermissionSchema>;
export const permissionColumns = getTableColumns(permission)
