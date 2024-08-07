import { and, eq, ne, sql } from "drizzle-orm";
import { type NewProyek, type Proyek, proyek, type UpdateProyek } from "@/databases/proyek/schema";

export const getProyek = async (tx = db) => {
    return await tx.select().from(proyek).orderBy(proyek.kode);
};

export const getProyekById = async (id: Proyek["id"], tx = db) => {
    const [data] = await tx.select().from(proyek).where(eq(proyek.id, id));
    return data;
};

export const createProyek = async (form: NewProyek, tx = db) => {
    const [dataProyek] = await tx.select().from(proyek).where(and(eq(proyek.kode, form.kode)));
    if (dataProyek) {
        throw ValidationError("Kode Sudah ada");
    }
    const [data] = await tx.insert(proyek).values(form).returning();
    return data;
};

export const updateProyek = async (id: Proyek["id"], form: UpdateProyek, tx = db) => {
    const [dataProyek] = await tx.select().from(proyek).where(and(eq(proyek.kode, form.kode), ne(proyek.id, id)));
    if (dataProyek) {
        throw ValidationError("Kode Sudah ada");
    }

    const [data] = await tx
        .update(proyek)
        .set({ ...form, updated_at: sql`NOW()` })
        .where(eq(proyek.id, id))
        .returning();
    return data;
};

export const deleteProyek = async (id: Proyek["id"], tx = db) => {
    try {
        const [data] = await tx.delete(proyek).where(eq(proyek.id, id)).returning();
        return data;
    } catch (error) {
        throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
    }
};
