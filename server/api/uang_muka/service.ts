import { and, asc, desc, eq, getTableColumns, gt, like, ne, sql } from "drizzle-orm";
import { ToString, formatDate } from "../../libs/formater";
import { nomorGlTrans } from "../../libs/nomor";
import { getAccountByCode } from "../account/service";
import { kontak } from "../kontak/schema";
import { NewUangMuka, UangMuka, UpdateUangMuka, uangMukaColumns, uang_muka } from "./schema";
import { purchase_order } from "../purchase_order/schema";
import { NewAccGlDetail, insertAccGlDetailSchema } from "../accounting/acc_gl_trans/acc_gl_detail/schema";
import { insertAccGlTransSchema } from "../accounting/acc_gl_trans/schema";
import { createAccGlTrans } from "../accounting/acc_gl_trans/service";

export const getUangMuka = async ({ id_kontak, status }: { id_kontak?: number; status?: string }, tx = db) => {
    const query = tx
        .select({
            ...uangMukaColumns,
            supplier: kontak.kontak,
            nomor_po: purchase_order.nomor,
        })
        .from(uang_muka)
        .leftJoin(purchase_order, eq(purchase_order.id, uang_muka.id_po))
        .leftJoin(kontak, eq(kontak.id, uang_muka.id_supplier));

    if (id_kontak && status) {
        query.where(and(eq(uang_muka.id_supplier, id_kontak), eq(uang_muka.status, status)));
    } else {
        if (id_kontak) {
            query.where(eq(uang_muka.id_supplier, id_kontak));
        }
        if (status) {
            query.where(eq(uang_muka.status, status));
        }
    }

    const data = await query.orderBy(desc(uang_muka.tanggal), desc(uang_muka.id));
    return data;
};

export const getUangMukaById = async (params: UangMuka["id"], tx = db) => {
    const [data] = await tx
        .select({
            ...uangMukaColumns,
            modified_name: kontak.kontak,
            supplier: kontak.kontak,
            nomor_po: purchase_order.nomor,
        })
        .from(uang_muka)
        .innerJoin(kontak, eq(kontak.id, uang_muka.id_supplier))
        .innerJoin(purchase_order, eq(uang_muka.id_po, purchase_order.id))
        .where(eq(uang_muka.id, params));
    return data;
};

export const getUangMukaByPo = async (params: UangMuka["id"], tx = db) => {
    const data = await tx.execute(sql`SELECT a.*
    FROM uang_muka a
    WHERE a.id NOT IN (SELECT aa.id_uang_muka FROM ap aa WHERE a.id=aa.id_uang_muka) AND a.id_po = ${params}`);
    return data[0];
};

export const createUangMuka = async (form: NewUangMuka, tx = db) => {
    const [data] = await tx.insert(uang_muka).values(form).returning();
    return data;
};

export const updateUangMuka = async (params: UangMuka["id"], form: UpdateUangMuka, tx = db) => {
    const [data] = await tx
        .update(uang_muka)
        .set({ ...form, updated_at: sql`NOW()` })
        .where(eq(uang_muka.id, params))
        .returning();
    return data;
};

export const deleteUangMuka = async (id: UangMuka["id"], tx = db) => {
    try {
        const data = await tx.transaction(async (trx) => {
            const [deletedUangMuka] = await trx
                .delete(uang_muka)
                .where(and(eq(uang_muka.id, id), eq(uang_muka.status, "D")))
                .returning();
            return { ...deletedUangMuka };
        });
        return data;
    } catch (error) {
        console.error(error);
        throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
    }
};

export const getPurchaseOrder = async (params: UangMuka["id_po"], tx = db) => {
    const Columns = getTableColumns(purchase_order);
    const data = await tx
        .select({
            ...column,
            id_po: purchase_order.id,
        })
        .from(purchase_order)
        .where(eq(purchase_order.id, params));
    return data;
};

export const checkIfUangMukaPosting = async (id: UangMuka["id"], tx = db) => {
    try {
        const [data] = await tx
            .select({
                status: uang_muka.status,
            })
            .from(uang_muka)
            .where(and(eq(uang_muka.id, id), eq(uang_muka.status, "C")));
        return data;
    } catch (error) {
        throw ValidationError("Not Found");
    }
};

export const createJurnal = async (data: UangMuka, tx = db) => {
    return await tx.transaction(async (tx) => {
        //Tambah ke dalam ACC GL Trans;
        const numberGL = await nomorGlTrans(formatDate(data.tanggal), tx);

        const validate = insertAccGlTransSchema.parse({
            journal_code: "UM",
            gl_number: numberGL,
            gl_date: formatDate(data.tanggal),
            note: data.keterangan,
            is_posting: true,
            reference: data.nomor,
        });

        // Tambah Detailnya
        let dataAccGlDetail: NewAccGlDetail[] = [];
        let line = 0; // definsikan urut dari 0
        let uangMuka = parseFloat(data.bayar as string);
        if (data.is_pajak) {
            // ambil id account by kode account dengan nama PPN Masuk
            const AccountPPN = await getAccountByCode("1005-00-00001", tx); // ubah jika kode berubah
            if (!AccountPPN) {
                throw ValidationError("Account Harga Pokok Penjualan Belum Ada");
            }
            uangMuka = parseFloat(data.bayar as string) / (1 + 0.11);
            const totalPajak = parseFloat(data.bayar as string) - uangMuka;
            dataAccGlDetail.push({
                gl_number: numberGL,
                line: ++line,
                id_account: AccountPPN.id,
                amount: ToString(totalPajak) as string,
                is_debit: true,
                description: data.keterangan,
            });
        }

        // // ambil id account by kode account dengan biaya dibayar dimuka
        const AccountUangMuka = await getAccountByCode("1004-00-00009", tx); // ubah jika kode berubah
        if (!AccountUangMuka) {
            throw ValidationError("Account Persediaan Belum Ada");
        }

        dataAccGlDetail.push({
            gl_number: numberGL,
            line: ++line,
            id_account: AccountUangMuka.id,
            amount: ToString(uangMuka) as string,
            is_debit: true,
            description: data.keterangan,
        });

        // ambil id account by kas
        dataAccGlDetail.push({
            gl_number: numberGL,
            line: ++line,
            id_account: data.id_account,
            amount: ToString(data.bayar) as string,
            is_debit: false,
            description: data.keterangan,
        });

        const validateDetail = dataAccGlDetail.map((item) => {
            return insertAccGlDetailSchema.parse(item);
        });

        await createAccGlTrans(validate, validateDetail, tx);
    });
};

export const getByIdPo = async (params: UangMuka["id_po"], tx = db) => {
    const data = await tx
        .select({
            ...uangMukaColumns,
            modified_name: kontak.kontak,
            supplier: kontak.kontak,
            nomor_po: purchase_order.nomor,
        })
        .from(uang_muka)
        .innerJoin(kontak, eq(kontak.id, uang_muka.id_supplier))
        .innerJoin(purchase_order, eq(uang_muka.id_po, purchase_order.id))
        .where(eq(uang_muka.id_po, params));
    return data[0] ?? null;
};
