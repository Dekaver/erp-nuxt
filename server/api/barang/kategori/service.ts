import { eq } from "drizzle-orm";
import { type NewKategoriBarang, type KategoriBarang, kategori_barang, kategoriBarangColumns } from "./schema";
import { account } from "../account/schema";

export const getKategoriBarang = async (tx = db) => {
    const data = await tx
        .select({
            ...kategoriBarangColumns,
            account_name: account.name,
            account_code: account.code,
        })
        .from(kategori_barang)
        .leftJoin(account, eq(kategori_barang.id_account, account.id))
        .orderBy(kategori_barang.id);
    return data;
};

export const getKategoriBarangById = async (params: KategoriBarang["id"], tx = db) => {
    const [data] = await tx.select().from(kategori_barang).where(eq(kategori_barang.id, params));
    return data;
};

export const createKategoriBarang = async (params: NewKategoriBarang, tx = db) => {
    const [data] = await tx.insert(kategori_barang).values(params).returning();
    return data;
};

export const updateKategoriBarang = async (params: NewKategoriBarang["id"], form: NewKategoriBarang, tx = db) => {
    const [data] = await tx
        .update(kategori_barang)
        .set(form)
        .where(eq(kategori_barang.id, params as number))
        .returning();
    return data;
};

export const deleteKategoriBarang = async (id: KategoriBarang["id"], tx = db) => {
    const [data] = await tx.delete(kategori_barang).where(eq(kategori_barang.id, id)).returning();
    return data;
};
