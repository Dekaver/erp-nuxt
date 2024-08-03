import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { AnyPgColumn, integer, pgTable, text, unique, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { permission } from '../permission/schema';
import { timestamps } from '../schema';

export const menu = pgTable(
    'menu',
    {
        id: integer('id').primaryKey().notNull(),
        id_permission: integer('id_permission').references(() => permission.id),
        name: varchar('name').notNull(),
        icon: varchar('icon'),
        outcome: varchar('outcome'),
        urut: integer('urut'),
        parent: integer('parent').references((): AnyPgColumn => menu.id),
        keterangan: text('keterangan'),
        jenis: varchar('jenis', { length: 1 }), // D: Detail, G: Group
        target: varchar('target'),
        url: varchar('url'),
        ...timestamps,
    },
    (table) => {
        return {
            unique: unique().on(table.name, table.parent),
        };
    }
);

export const insertMenuSchema = createInsertSchema(menu);
export const updateMenuSchema = createInsertSchema(menu).omit({ id: true, created_by: true, created_at: true });

export type Menu = InferSelectModel<typeof menu>;
export type NewMenu = z.infer<typeof insertMenuSchema>;
export type UpdateMenu = z.infer<typeof updateMenuSchema>;

export const MenuColumns = getTableColumns(menu);
