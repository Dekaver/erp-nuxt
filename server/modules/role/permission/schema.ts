import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { pgTable, integer, serial, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { permission } from "../../permission/schema";
import { role } from "../schema";

export const role_permission = pgTable(
    "role_permission",
    {
        id_role: integer("id_role")
            .notNull()
            .references(() => role.id),
        id_permission: integer("id_permission")
            .notNull()
            .references(() => permission.id, { onDelete: "cascade" }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id_role, table.id_permission] }),
        };
    },
);

export const insertRolePermissionSchema = createInsertSchema(role_permission);

export type RolePermission = InferSelectModel<typeof role_permission>;
export type NewRolePermission = z.infer<typeof insertRolePermissionSchema>;

export const rolePermissionColumns = getTableColumns(role_permission);
