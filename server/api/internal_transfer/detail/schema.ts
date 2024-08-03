import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { barang } from '../../barang/schema';
import { internal_transfer } from '../schema';
import { satuan } from '../../barang/satuan/schema';

export const internal_transfer_detail = pgTable(
    'internal_transfer_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => internal_transfer.id),
        id_barang: integer('id_barang')
            .notNull()
            .references(() => barang.id),
        id_satuan: integer('id_satuan')
            .notNull()
            .references(() => satuan.id),
        urut: integer('urut').notNull(),
        qty: numeric('qty').notNull().default('0'),
        diterima: numeric('diterima').notNull().default('0'),
        keterangan: varchar('keterangan'),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);

export const insertInternalTransferDetailSchema = createInsertSchema(internal_transfer_detail);

export type InternalTransferDetail = InferSelectModel<typeof internal_transfer_detail>;
export type NewInternalTransferDetail = z.infer<typeof insertInternalTransferDetailSchema>;

export const InternalTransferDetailColumns = getTableColumns(internal_transfer_detail);
