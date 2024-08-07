import { eq, sql } from 'drizzle-orm';
import { type NewPenggunaPermission, type PenggunaPermission, PenggunaPermissionColumns, pengguna_permission } from '@/databases/pengguna/permission/schema';
import { permission } from '@/databases/permission/schema';

export const getPenggunaPermission = async (tx = db) => {
    const data = await tx.select().from(pengguna_permission);
    return data;
};

export const getPenggunaPermissionById = async (params: PenggunaPermission['id'], tx = db) => {
    const data = await tx.select()
        .from(pengguna_permission)
        .where(eq(pengguna_permission.id, params));
    return data;
};

export const getPenggunaPermissionStringById = async (params: PenggunaPermission['id'], tx = db) => {
    const [data] = await tx
        .select({ 
			permission: sql<string>`STRING_AGG(${permission.permission}, ',')` 
		})
        .from(pengguna_permission)
		.innerJoin(permission, eq(permission.id, pengguna_permission.id_permission))
        .where(eq(pengguna_permission.id, params)).groupBy(pengguna_permission.id);
    return data;
};

export const createPenggunaPermission = async (form: NewPenggunaPermission[], tx = db) => {
    const data = await tx.insert(pengguna_permission).values(form).returning();
    return data;
};

export const updatePenggunaPermission = async (params: PenggunaPermission['id'], form: NewPenggunaPermission[], tx = db) => {
    return await tx.transaction(async (tx) => {
        await deletePenggunaPermission(params, tx);
        return await createPenggunaPermission(form, tx);
    });
};

export const deletePenggunaPermission = async (params: PenggunaPermission['id'], tx = db) => {
    const data = await tx.delete(pengguna_permission).where(eq(pengguna_permission.id, params)).returning();
    return data;
};
