import { eq } from "drizzle-orm";
import { type NewDepartemen, type Departemen, departemen } from "@/databases/departemen/schema";

export const getDepartemen = async (tx = db) => {
    const data = await tx.select().from(departemen);
    return data;
};

export const getDepartemenById = async (params: Departemen["id"], tx = db) => {
    const [data] = await tx.select().from(departemen).where(eq(departemen.id, params));
    return data;
};

export const createDepartemen = async (params: NewDepartemen, tx = db) => {
    const [data] = await tx.insert(departemen).values(params).returning();
    return data;
};

export const updateDepartemen = async (params: NewDepartemen, tx = db) => {
    const [data] = await tx
        .update(departemen)
        .set(params)
        .where(eq(departemen.id, params.id as number))
        .returning();
    return data;
};

export const deleteDepartemen = async (params: Departemen["id"], tx = db) => {
    const [data] = await tx.delete(departemen).where(eq(departemen.id, params)).returning();
    return data;
};
