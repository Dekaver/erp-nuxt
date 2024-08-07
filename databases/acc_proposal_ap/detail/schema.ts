import { InferSelectModel, getTableColumns } from 'drizzle-orm';
import { date, integer, numeric, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { kontak } from '../../kontak/schema';
import { acc_proposal_ap } from '../schema';

export const acc_proposal_ap_detail = pgTable(
    'acc_proposal_ap_detail',
    {
        id: integer('id')
            .notNull()
            .references(() => acc_proposal_ap.id),
        id_kontak: integer('id_kontak')
            .notNull()
            .references(() => kontak.id),
        urut: integer('urut').notNull(),
        referensi: varchar('referensi', { length: 100 }).notNull(),
        tanggal_jatuh_tempo: date('tanggal_jatuh_tempo', { mode: 'string' }).notNull(),
        total: numeric('total').default('0').notNull(),
        total_pajak: numeric('total_pajak').default('0'),
        grandtotal: numeric('grandtotal').default('0').notNull(),
        keterangan: varchar('keterangan', { length: 500 }),
    },
    (table) => {
        return {
            accProposalApDetailPkey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);

export const insertAccProposalApDetailSchema = createInsertSchema(acc_proposal_ap_detail);

export type AccProposalApDetail = InferSelectModel<typeof acc_proposal_ap_detail>;
export type NewAccProposalApDetail = z.infer<typeof insertAccProposalApDetailSchema>;

export const AccProposalApDetailColumns = getTableColumns(acc_proposal_ap_detail);
