import { bigint, boolean, integer, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { barang } from '../schema';

export const barangImages = pgTable(
    'barang_images',
    {
        id: bigint('id', { mode: 'number' })
            .notNull()
            .references(() => barang.id),
        nama_gambar: varchar('nama_gambar', { length: 30 }).notNull(),
        deskripsi: varchar('deskripsi'),
        is_utama: boolean('is_utama').default(false).notNull(),
        urut: integer('urut').notNull(),
    },
    (table) => {
        return {
            primaryKey: primaryKey({ columns: [table.id, table.urut] }),
        };
    }
);
