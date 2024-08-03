import { and, eq, sql } from "drizzle-orm";


import { invoice } from "../schema";
import { insertInvoicePersetujuanSchema, invoice_persetujuan, InvoicePersetujuan, invoicePersetujuanColumn } from "./schema";
import { getPegawaiById } from "../../pegawai/service";
import { pegawai } from "../../pegawai/schema";
import { jabatan } from "../../jabatan/schema";
import { getInvoiceById } from "../service";
import { insertAccArFakturSchema } from "../../ar/schema";
import { formatDate } from "../../../libs/formater";
import { createAccArFaktur, deleteAccArFaktur } from "../../ar/service";

export const getInvoicePersetujuan = async (id: InvoicePersetujuan["id"], tx = db) => {
    return await tx
        .select({
            ...invoicePersetujuanColumn,
            nama: pegawai.nama,
            jabatan: jabatan.jabatan,
        })
        .from(invoice_persetujuan)
        .innerJoin(pegawai, eq(pegawai.id, invoice_persetujuan.id_pegawai))
        .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .where(eq(invoice_persetujuan.id, id))
        .orderBy(invoice_persetujuan.urut);
};

export const getInvoicePersetujuanByPegawai = async (id: InvoicePersetujuan["id"], id_pegawai: InvoicePersetujuan["id_pegawai"], tx = db) => {
    const [data] = await tx
        .select()
        .from(invoice_persetujuan)
        .where(and(eq(invoice_persetujuan.id, id), eq(invoice_persetujuan.id_pegawai, id_pegawai)));
    return data;
};

export const createInvoicePersetujuan = async (id: InvoicePersetujuan["id"], id_pegawai: InvoicePersetujuan["id_pegawai"], urut: InvoicePersetujuan["urut"] = 1, tx = db) => {
    const dataPegawai = await getPegawaiById(id_pegawai, tx);

    const form = insertInvoicePersetujuanSchema.parse({
        id: id,
        urut: urut,
        id_pegawai: id_pegawai,
        tanggal_persetujuan: null,
        id_jabatan: dataPegawai.id_jabatan,
        status: false,
    });
    const [data] = await tx.insert(invoice_persetujuan).values(form).returning();

    return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
};

export const deleteInvoicePersetujuan = async (id: InvoicePersetujuan["id"], tx = db) => {
    const deletePersetujuan = await tx.delete(invoice_persetujuan).where(eq(invoice_persetujuan.id, id)).returning();
    return deletePersetujuan;
};

export const updatePersetujuanInvoice = async (
    id: InvoicePersetujuan["id"],
    id_pegawai: InvoicePersetujuan["id_pegawai"],
    status: InvoicePersetujuan["status"],
    keterangan: InvoicePersetujuan["keterangan"],
    tx = db,
) => {
    const returning = await tx.transaction(async (tx) => {
        const [dataPersetujuan] = await tx
            .update(invoice_persetujuan)
            .set({
                status: status,
                tanggal_persetujuan: sql`NOW()`,
                keterangan: keterangan,
            })
            .where(and(eq(invoice_persetujuan.id, id), eq(invoice_persetujuan.id_pegawai, id_pegawai)))
            .returning();

        const [max] = await tx
            .select({
                urut: sql`MAX(urut)`,
            })
            .from(invoice_persetujuan)
            .where(eq(invoice_persetujuan.id, id));

        if (dataPersetujuan.urut == max.urut && status) {
            await tx.update(invoice).set({ status: "O" }).where(eq(invoice.id, id));

            const data = await getInvoiceById(dataPersetujuan.id, tx);

            const validateAccAr = insertAccArFakturSchema.parse({
                invoice: data.nomor,
                invoice_date: formatDate(data.tanggal),
                id_customer: data.id_kontak,
                id_top: data.id_top,
                top: data.top,
                amount: data.grandtotal,
                pay: "0",
                discount: data.total_discount,
                due_date: formatDate(data.tanggal_jatuh_tempo as string),
            });

            // hapus acc_ar_faktur
            await deleteAccArFaktur(data.nomor, tx);
            await createAccArFaktur(validateAccAr, tx);

            return { ...dataPersetujuan, update_status: "O" };
        } else if (!status) {
            await tx.update(invoice).set({ status: "R" }).where(eq(invoice.id, id));
            return { ...dataPersetujuan, update_status: "R" };
        }
        return dataPersetujuan;
    });
    return returning;
};

export const getPersetujuanInvoice = async (id_pegawai: InvoicePersetujuan["id_pegawai"], tx = db) => {
    const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, k.kontak as customer, g.nomor as referensi, a.keterangan as keterangan_pr, a.status as status_pr, c.nama as created_name, b.*
                FROM invoice a  
                INNER JOIN sales_order g ON a.id_so = g.id
                INNER JOIN kontak k ON a.id_kontak = k.id
                LEFT JOIN invoice_persetujuan b ON a.id = b.id 
                LEFT JOIN hr.pegawai c ON a.created_by = c.id
                WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
                AND (
                    b.urut = 1 OR
                    (b.urut > 1 AND EXISTS (
                        SELECT 1
                        FROM invoice z
                        INNER JOIN invoice_persetujuan y ON z.id = y.id
                        WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
                            AND z.nomor = a.nomor
                    ))
                ) AND a.status='S'
                ORDER BY nomor, urut`);
    return data;
};
