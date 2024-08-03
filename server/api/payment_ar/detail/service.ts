import { eq } from 'drizzle-orm';

import db from '../../../libs/db';
import { acc_ar_faktur } from '../../ar/schema';
import { NewPaymentArDetail, payment_ar_detail, PaymentArDetail, paymentArDetailColumns } from './schema';

export const getPaymentArDetailById = async (id: PaymentArDetail["id"], tx = db) => {
    return await tx
        .select({
            ...paymentArDetailColumns,
            date: acc_ar_faktur.invoice_date,
        })
        .from(payment_ar_detail)
        .innerJoin(acc_ar_faktur, eq(acc_ar_faktur.invoice, payment_ar_detail.invoice))
        .where(eq(payment_ar_detail.id, id));
};


export const createPaymentArDetail = async (form: NewPaymentArDetail[], tx = db) => {
    return await tx.insert(payment_ar_detail).values(form).returning();
};

export const deletePaymentArDetail = async (id: PaymentArDetail["id"], tx = db) => {
    return await tx.delete(payment_ar_detail).where(eq(payment_ar_detail.id, id)).returning();
};