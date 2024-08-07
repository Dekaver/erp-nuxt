import { eq, sql } from "drizzle-orm";
import { type NewSatuan, type Satuan, satuan, SatuanColumns, UpdateSatuan } from "@/databases/barang/satuan/schema";

export const getSatuan = async (tx = db) => {
    return await tx.select({ ...SatuanColumns, konversi: sql<number>`1` }).from(satuan);
};

export const getSatuanById = async (params: Satuan["id"], tx = db) => {
    const [data] = await tx.select().from(satuan).where(eq(satuan.id, params));
    return data;
};

export const createSatuan = async (params: NewSatuan, tx = db) => {
    const [data] = await tx.insert(satuan).values(params).returning();
    return data;
};

export const updateSatuan = async (params: Satuan["id"], form: UpdateSatuan, tx = db) => {
    const [data] = await tx.update(satuan).set(form).where(eq(satuan.id, params)).returning();
    return data;
};

export const deleteSatuan = async (id: Satuan["id"], tx = db) => {
    try {
        const [data] = await tx.delete(satuan).where(eq(satuan.id, id)).returning();
        return data;
    } catch (error) {
        throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
    }
};
