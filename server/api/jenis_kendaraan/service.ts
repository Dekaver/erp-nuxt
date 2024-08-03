import { eq } from "drizzle-orm";
import { jenis_kendaraan, JenisKendaraan, NewJenisKendaraan } from "./schema";

export const getJenisKendaraan = async (tx = db) => {
    const data = await tx.select().from(jenis_kendaraan);
    return data;
};

export const getJenisKendaraanById = async (id: JenisKendaraan["id"], tx = db) => {
    const data = await tx.select().from(jenis_kendaraan).where(eq(jenis_kendaraan.id, id));
    return data[0];
};

export const createJenisKendaraan = async (form: NewJenisKendaraan, tx = db) => {
    const data = await tx.insert(jenis_kendaraan).values(form).returning();
    return data[0];
};

export const updateJenisKendaraan = async (id: JenisKendaraan["id"], form: NewJenisKendaraan, tx = db) => {
    const data = await tx.update(jenis_kendaraan).set(form).where(eq(jenis_kendaraan.id, id)).returning();
    return data[0];
};

export const deleteJenisKendaraan = async (id: JenisKendaraan["id"], tx = db) => {
    try {
        const [data] = await tx.delete(jenis_kendaraan).where(eq(jenis_kendaraan.id, id)).returning();
        return data;
    } catch (error) {
        throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
    }
};
