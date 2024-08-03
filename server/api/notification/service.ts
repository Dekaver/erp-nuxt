import { asc, eq, sql } from "drizzle-orm";
import { type NewNotification, type Notification, notification, UpdateNotification } from "./schema";

export const getNotification = async (tx = db) => {
    const data = await tx.select().from(notification).orderBy(asc(notification.id));
    return data;
};

export const getNotificationById = async (id: Notification["id"], tx = db) => {
    const [data] = await tx.select().from(notification).where(eq(notification.id, id));
    return data;
};

export const getNotificationByIdPegawai = async (id_pegawai: Notification["id_pegawai"], tx = db) => {
    const [data] = await tx.select().from(notification).where(eq(notification.id_pegawai, id_pegawai));
    return data;
};



export const createNotification = async (id: NewNotification, tx = db) => {
    const [data] = await tx.insert(notification).values(id).returning();
    return data;
};

export const updateNotification = async (id: Notification["id"],form: UpdateNotification, tx = db) => {
    const [data] = await tx
        .update(notification)
        .set({...form, updated_at: sql`NOW()`})
        .where(eq(notification.id, id))
        .returning();
    return data;
};

export const deleteNotification = async (id: Notification["id"], tx = db) => {
    const [data] = await tx.delete(notification).where(eq(notification.id, id)).returning();
    return data;
};
