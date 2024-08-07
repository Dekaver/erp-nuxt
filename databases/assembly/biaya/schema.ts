import { InferSelectModel } from 'drizzle-orm';
import { pgTable, integer, numeric, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { account } from '../../account/schema';
import { assembly } from '../schema';

export const assembly_biaya = pgTable(
    'assembly_biaya',
    {
        id: integer('id')
            .notNull()
            .references(() => assembly.id),
        id_account: integer('id_account')
            .notNull()
            .references(() => account.id),
        urut: integer('urut').notNull(),
        modal: numeric('modal').notNull(),
        biaya: numeric('biaya').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.id_account] }),
        };
    }
);

export const insertAssemblyBiayaSchema = createInsertSchema(assembly_biaya);

export type AssemblyBiaya = InferSelectModel<typeof assembly_biaya>;
export type NewAssemblyBiaya = z.infer<typeof insertAssemblyBiayaSchema>;
