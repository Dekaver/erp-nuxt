import { eq } from "drizzle-orm";

import { NewPaymentApDetail, payment_ap_detail } from "./schema";


export const getPaymentApDetailById = async (id: NewPaymentApDetail['id'], tx = db) => {
    return await tx.select().from(payment_ap_detail).where(eq(payment_ap_detail.id, id));
};

export const createPaymentApDetail = async (form: NewPaymentApDetail[], tx = db) => {
    return await tx.insert(payment_ap_detail).values(form).returning();
};

export const deletePaymentApDetail = async (id: NewPaymentApDetail['id'], tx = db) => {
    return await tx.delete(payment_ap_detail).where(eq(payment_ap_detail.id, id)).returning();
};
