import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { permission } from '../../permission/schema';
import { pengguna } from '../../pengguna/schema';

export const pengguna_permission = pgTable(
    'pengguna_permission',
    {
        id: integer('id')
            .notNull()
            .references(() => pengguna.id),
        id_permission: integer('id_permission')
            .notNull()
            .references(() => permission.id, { onDelete: 'cascade' }),
    },
    (table) => {
        return {
            primaryKey: primaryKey(table.id, table.id_permission),
        };
    }
);

export const insertPenggunaPermissionSchema = createInsertSchema(pengguna_permission);

export type PenggunaPermission = InferSelectModel<typeof pengguna_permission>;
export type NewPenggunaPermission = z.infer<typeof insertPenggunaPermissionSchema>;

export const PenggunaPermissionColumns = getTableColumns(pengguna_permission);
