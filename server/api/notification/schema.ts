import { getTableColumns, InferSelectModel } from 'drizzle-orm';
import { char, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { pegawai } from '../pegawai/schema';
import { timestamps } from '../schema';

export const notification = pgTable('notification', {
    id: integer('id').primaryKey().notNull(),
    judul: varchar('name').notNull(),
    deskripsi: varchar('icon'),
    url: varchar('outcome'),
    status: char('status', { length: 1 }).notNull(), // S = send, R = read, C = close
    id_pegawai: integer('id_pegawai')
        .notNull()
        .references(() => pegawai.id),
    ...timestamps,
});

export const insertNotificationSchema = createInsertSchema(notification);
export const updateNotificationSchema = createInsertSchema(notification).omit({ id: true, created_by: true, created_at: true });

export type Notification = InferSelectModel<typeof notification>;
export type NewNotification = z.infer<typeof insertNotificationSchema>;
export type UpdateNotification = z.infer<typeof updateNotificationSchema>;

export const NotificationColumns = getTableColumns(notification);
