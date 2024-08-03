import { eq, sql } from "drizzle-orm";
import db from "../../../libs/db";
import { role_permission } from "./permission/schema";
import { role, Role, NewRole, roleColumns } from "./schema";
import { permission } from "../permission/schema";
import { pengguna } from "../pengguna/schema";
import { pegawai } from "../pegawai/schema";

export const getRole = async (tx = db) => {
    const data = await tx
        .select({
            ...roleColumns,
            permission: sql<number[]>`jsonb_agg(DISTINCT ${permission.permission})`.as("children"),
            pegawai: sql<string[]>`jsonb_agg(DISTINCT ${pegawai.nama})`.as("user_name"),
        })
        .from(role)
        .leftJoin(role_permission, eq(role.id, role_permission.id_role))
        .leftJoin(permission, eq(role_permission.id_permission, permission.id))
        .leftJoin(pengguna, eq(role.id, pengguna.role))
        .leftJoin(pegawai, eq(pegawai.id, pengguna.id_pegawai))
        .groupBy(role.id);
    return data;
};

export const getRoleById = async (params: Role["id"], tx = db) => {
    const [data] = await tx
        .select({
            id: role.id,
            role: role.role,
        })
        .from(role)
        .where(eq(role.id, params));
    // const data = db.execute(sql`
    // SELECT
    //   DISTINCT p.id_role,
    //   CASE
    //     WHEN
    //         COUNT(c.id) > 0
    //     THEN
    //         jsonb_agg(c.id_permission)
    //     ELSE
    //         NULL
    //   END
    //   AS children
    // FROM
    //   role_permission p
    //   LEFT JOIN
    //     role_permission c
    //     ON p.id_role = c.id_role
    // WHERE
    //   p.id_role=1
    // GROUP BY
    //   p.id_role, p.id_permission
    // `);
    return data;
};
export const getRoleByRole = async (params: Role["role"], tx = db) => {
    const data = await tx
        .select({
            id: role.id,
            role: role.role,
            id_permission: role_permission.id_permission,
        })
        .from(role)
        .leftJoin(role_permission, eq(role.id, role_permission.id_role))
        .where(eq(role.role, params));
    return data;
};

export const createRole = async (params: NewRole, tx = db) => {
    const [data] = await tx.insert(role).values(params).returning();
    return data;
};

export const updateRole = async (params: Role["id"], form: NewRole, tx = db) => {
    const [data] = await tx.update(role).set(form).where(eq(role.id, params)).returning();
    return data;
};

export const deleteRole = async (id: Role["id"], tx = db) => {
    const [data] = await tx.delete(role).where(eq(role.id, id)).returning();
    return data;
};
