import { eq } from "drizzle-orm";
import { type NewBrand, type Brand, brand } from "../brand/schema";

export const getBrand = async (tx = db) => {
    const data = await db.select().from(brand);
    return data;
};

export const getBrandById = async (params: Brand["id"], tx = db) => {
    const [data] = await db.select().from(brand).where(eq(brand.id, params));
    return data;
};

export const createBrand = async (params: NewBrand, tx = db) => {
    const [data] = await db.insert(brand).values(params).returning();
    return data;
};

export const updateBrand = async (params: NewBrand, tx = db) => {
    const [data] = await db
        .update(brand)
        .set(params)
        .where(eq(brand.id, params.id as number))
        .returning();
    return data;
};

export const deleteBrand = async (id: Brand["id"], tx = db) => {
    const [data] = await db.delete(brand).where(eq(brand.id, id)).returning();
    return data;
};
