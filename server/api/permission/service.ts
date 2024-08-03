import { asc, eq, ilike, or, SQL, sql } from "drizzle-orm";
import { type NewPermission, type Permission, permission, permissionColumns } from "../permission/schema";
import { alias } from "drizzle-orm/pg-core";
import { role, role_permission } from "../role/schema";
import { pengguna } from "../pengguna/schema";
import { pengguna_permission } from "../pengguna/permission/schema";

/**
 * Retrieves a list of permissions based on the provided search criteria.
 * @param params - The search criteria.
 * @param params.search - The search term.
 * @param params.parent - The permission parent ID.
 * @param params.id - The permission ID.
 * @param params.limit - The maximum number of results to return.
 * @returns A Promise that resolves to an array of Permission objects.
 */

export const getPermission = async (
	params: {
		search?: string;
		parent?: number;
		id?: number;
	},
	tx = db,
): Promise<Permission[]> => {
	const parent = alias(permission, "parent");
	const query = tx
		.select({
			...permissionColumns,
			permission_parent: parent.permission,
			level_parent: parent.level,
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

	return query.where(or(...consdition)).orderBy(asc(permission.parent), asc(permission.permission));
};

export const getParent = async () => {
	const data = await db.select().from(permission).where(eq(permission.level, 1));
	return data;
};

export const getPermissionById = async (params: Permission["id"]) => {
	const data = await db.select().from(permission).where(eq(permission.id, params));
	return data[0];
};

export const getPermissionByPengguna = async (params: number, tx = db) => {
	const [dataPermission] = await tx
		.select({ permission: sql<string[]>`JSON_AGG(permission.permission)` })
		.from(permission)
		.innerJoin(pengguna_permission, eq(pengguna_permission.id_permission, permission.id))
		.innerJoin(pengguna, eq(pengguna.id, pengguna_permission.id))
		.where(eq(pengguna.id, params));
	return dataPermission?.permission;
};

export const getPermissionByRole = async (params: number, tx = db) => {
	const [dataPermission] = await tx
		.select({ permission: sql<string[]>`JSON_AGG(permission.permission)` })
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
