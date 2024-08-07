import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { kantor } from '../kantor/schema';

export const target = pgTable(
    'target',
    {
        tahun: integer('tahun').notNull(),
        id_kantor: integer('id_kantor').notNull(),
        p0: numeric('p0').default('0').notNull(),
        p1: numeric('p1').default('0').notNull(),
        p2: numeric('p2').default('0').notNull(),
        p3: numeric('p3').default('0').notNull(),
        p4: numeric('p4').default('0').notNull(),
        p5: numeric('p5').default('0').notNull(),
        p6: numeric('p6').default('0').notNull(),
        p7: numeric('p7').default('0').notNull(),
        p8: numeric('p8').default('0').notNull(),
        p9: numeric('p9').default('0').notNull(),
        p10: numeric('p10').default('0').notNull(),
        p11: numeric('p11').default('0').notNull(),
        p12: numeric('p12').default('0').notNull(),
        p13: numeric('p13').default('0').notNull(),
        o0: numeric('o0').default('0').notNull(),
        o1: numeric('o1').default('0').notNull(),
        o2: numeric('o2').default('0').notNull(),
        o3: numeric('o3').default('0').notNull(),
        o4: numeric('o4').default('0').notNull(),
        o5: numeric('o5').default('0').notNull(),
        o6: numeric('o6').default('0').notNull(),
        o7: numeric('o7').default('0').notNull(),
        o8: numeric('o8').default('0').notNull(),
        o9: numeric('o9').default('0').notNull(),
        o10: numeric('o10').default('0').notNull(),
        o11: numeric('o11').default('0').notNull(),
        o12: numeric('o12').default('0').notNull(),
        o13: numeric('o13').default('0').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.tahun, table.id_kantor] }),
        };
    }
);

export const insertTargetSchema = createInsertSchema(target);
export const updateTargetSchema = createInsertSchema(target).omit({ id_kantor: true, tahun: true });

export type Target = InferSelectModel<typeof target>;
export type NewTarget = z.infer<typeof insertTargetSchema>;
export type UpdateTarget = z.infer<typeof updateTargetSchema>;

export const TargetColumns = getTableColumns(target);
