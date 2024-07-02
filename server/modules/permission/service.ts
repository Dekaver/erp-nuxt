import { and, asc, eq, ilike, like, or, SQL, sql } from "drizzle-orm";
import { type NewPermission, type Permission, permission, permissionColumns } from "../permission/schema";
import db from "../../../libs/db";
import { alias } from "drizzle-orm/pg-core";
import { role } from "../role/schema";
import { role_permission } from "../role/permission/schema";

export const getPermission = async (params: any, tx = db) => {
    const parent = alias(permission, "parent");
    const query = tx
        .select({
            ...permissionColumns,
            permission_parent: parent.permission,
        })
        .from(permission)
        .leftJoin(parent, eq(permission.parent, parent.id));

    const consdition: SQL[] = [];
    if (params.search) {
        consdition.push(ilike(permission.permission, `%${params.search}%`));
    } else {
        consdition.push(ilike(permission.permission, `%%`));
    }

    if (params.parent) {
        consdition.push(ilike(parent.permission, `%${params.search}%`));
    }

    if (params.id) {
        consdition.push(eq(permission.id, params.id));
    }

    return query
        .where(or(...consdition))
        .orderBy(asc(permission.parent), asc(permission.permission))
        .limit(params.limit);
};

export const getParent = async () => {
    const data = await db.select().from(permission).where(eq(permission.level, 1));
    return data;
};

export const getPermissionById = async (params: Permission["id"]) => {
    const data = await db.select().from(permission).where(eq(permission.id, params));
    return data[0];
};

export const getPermissionByRole = async (params: number, tx = db) => {
    const [dataPermission] = await tx
        .select({ permission: sql`JSON_AGG(permission.permission)` })
        .from(permission)
        .innerJoin(role_permission, eq(role_permission.id_permission, permission.id))
        .innerJoin(role, eq(role.id, role_permission.id_role))
        .where(eq(role.id, params));

    return dataPermission?.permission;
};

export const createPermission = async (params: NewPermission) => {
    const [data] = await db.insert(permission).values(params).returning();
    return data;
};

export const updatePermission = async (params: Permission["id"], form: NewPermission) => {
    const [data] = await db.update(permission).set(form).where(eq(permission.id, params)).returning();
    return data;
};

export const deletePermission = async (id: Permission["id"]) => {
    const [data] = await db.delete(permission).where(eq(permission.id, id)).returning();
    return data;
};
