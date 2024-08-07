import { eq } from "drizzle-orm";


import { penerimaan_barang } from "@/databases/penerimaan_barang/schema";
import { ap_penerimaan_barang, ApPenerimaanBarang, apPenerimaanbarangColumns, NewApPenerimaanBarang } from "@/databases/ap/penerimaan_barang/schema";

export const getApPenerimaanBarangById = async (id: ApPenerimaanBarang["id_ap"], tx = db) => {
    return await tx
        .select({
            ...apPenerimaanbarangColumns,
            id: penerimaan_barang.id,
            id_po: penerimaan_barang.id_po,
            nomor: penerimaan_barang.nomor,
        })
        .from(ap_penerimaan_barang)
        .innerJoin(penerimaan_barang, eq(penerimaan_barang.id, ap_penerimaan_barang.id_penerimaan_barang))
        .where(eq(ap_penerimaan_barang.id_ap, id));
};

export const createApPenerimaanBarang = async (form: NewApPenerimaanBarang[], tx = db) => {
    const data = await tx.insert(ap_penerimaan_barang).values(form).returning();
    return data;
};

export const deleteApPenerimaanBarang = async (id: ApPenerimaanBarang["id_ap"], tx = db) => {
    const data = await tx.delete(ap_penerimaan_barang).where(eq(ap_penerimaan_barang.id_ap, id)).returning();
    return data;
};
