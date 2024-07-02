import { eq } from "drizzle-orm";
import { role_permission, RolePermission, NewRolePermission } from "./schema";
import db from "../../../../libs/db";

export const getRolePermission = async (tx = db) => {
    return await tx.select().from(role_permission);
};

export const getRolePermissionById = async (id: RolePermission["id_role"], tx = db) => {
    return await tx.select().from(role_permission).where(eq(role_permission.id_role, id));
};

export const createRolePermission = async (form: NewRolePermission[], tx = db) => {
    const data = await tx.insert(role_permission).values(form);
    return data[0];
};

export const updateRolePermission = async (id: RolePermission["id_role"], form: NewRolePermission, tx = db) => {
    const data = await tx.update(role_permission).set(form).where(eq(role_permission.id_role, id)).returning();
    return data[0];
};

export const deleteRolePermission = async (id: RolePermission["id_role"], tx = db) => {
    return await tx.delete(role_permission).where(eq(role_permission.id_role, id)).returning();
};
