// import { SQL, and, asc, eq, ilike, inArray, isNull, sql } from "drizzle-orm";
// import { type NewMenu, type Menu, menu, menuColumns } from "../menu/schema";
// import { Pegawai } from "../pegawai/schema";

// export const getMenu = async (tx = db) => {
//     const data = await tx.select().from(menu).orderBy(asc(menu.id));
//     return data;
// };

// export const getMenuOption = async (option: any, id?: Pegawai["id"], tx = db) => {
//     const data = tx.select({ ...menuColumns }).from(menu);
//     const where: SQL[] = [];
//     if (option.jenis) {
//         where.push(eq(menu.jenis, option.jenis));
//     }
//     if (id) {
//         data.innerJoin(
//             sql`(
//                 select
//                     permission, id_pegawai
//                 from
//                     "role"
//                     join role_permission on role_permission.id = role.id
//                     join "permission" on "permission".id = role_permission.id_permission
//                     join pengguna on pengguna."role" = role.id
//         ) as permission2`,
//             eq(sql`permission2.permission`, menu.permission),
//         );
//         where.push(eq(sql`permission2.id_pegawai`, id));
//     }
//     if (option.null_parent) {
//         where.push(isNull(menu.parent));
//     }
//     if (option.parent) {
//         where.push(eq(menu.jenis, option.parent));
//     }
//     data.where(and(...where));
//     return await data.orderBy(asc(menu.urut), asc(menu.id));
// };

// export const getMenuById = async (params: Menu["id"], tx = db) => {
//     const [data] = await tx.select().from(menu).where(eq(menu.id, params));
//     return data;
// };

// export const getMenuByOutcome = async (outcome: Menu["outcome"], tx = db) => {
//     const [data] = await tx
//         .select()
//         .from(menu)
//         .where(ilike(menu.outcome, `%menu-${outcome}%`));
//     return data;
// };

// export const getMenuChildByParent = async (parent: Menu["parent"], id?: Pegawai["id"], tx = db) => {
//     const data = tx.select({ ...menuColumns }).from(menu);
//     const where: SQL[] = [];

//     if (id) {
//         data.innerJoin(
//             sql`(
//                 select
//                     permission, id_pegawai
//                 from
//                     "role"
//                     join role_permission on role_permission.id = role.id
//                     join "permission" on "permission".id = role_permission.id_permission
//                     join pengguna on pengguna."role" = role.id
//         ) as permission2`,
//             eq(sql`permission2.permission`, menu.permission),
//         );
//         where.push(eq(sql`permission2.id_pegawai`, id));
//     }

//     return await data.where(and(eq(menu.parent, parent as number), ...where)).orderBy(menu.urut);
// };

// export const getMenuChildByParents = async (parent: Menu["id"][], tx = db) => {
//     return await tx.select().from(menu).where(inArray(menu.parent, parent)).orderBy(menu.urut);
// };

// export const createMenu = async (params: NewMenu, tx = db) => {
//     const [data] = await tx.insert(menu).values(params).returning();
//     return data;
// };

// export const updateMenu = async (id:Menu['id'], form: NewMenu, tx = db) => {
//     const [data] = await tx
//         .update(menu)
//         .set(form)
//         .where(eq(menu.id, id as number))
//         .returning();
//     return data;
// };

// export const deleteMenu = async (id: Menu["id"], tx = db) => {
//     const [data] = await tx.delete(menu).where(eq(menu.id, id)).returning();
//     return data;
// };
