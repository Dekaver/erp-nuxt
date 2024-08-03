// import { and, eq, gt, sql } from "drizzle-orm";
// import { AccProposalAp, AccProposalApDetail, NewAccProposalAp, NewAccProposalApDetail, acc_proposal_ap, acc_proposal_ap_detail } from "./schema";

// export const getAccProposalAp = async (tx = db) => {
//     const data = await tx.select().from(acc_proposal_ap);
//     return data;
// };

// export const getAccProposalApById = async (params: AccProposalAp["id"], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [AccProposalAp] = await trx.select().from(acc_proposal_ap).where(eq(acc_proposal_ap.id, params));

//         const AccProposalApDetail = await trx.select().from(acc_proposal_ap_detail).where(eq(acc_proposal_ap_detail.id, params));
//         return { ...AccProposalAp, detail: AccProposalApDetail };
//     });

//     return data;
// };

// export const createAccProposalAp = async (form: NewAccProposalAp, formDetail: NewAccProposalApDetail[], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [createdAccProposalAp] = await trx.insert(acc_proposal_ap).values(form).returning();
//         const createdAccProposalApDetail = await trx
//             .insert(acc_proposal_ap_detail)
//             .values(
//                 formDetail.map((item) => {
//                     return {
//                         ...item,
//                         id: createdAccProposalAp.id,
//                     };
//                 }),
//             )
//             .returning();
//         return { ...createdAccProposalAp, detail: createdAccProposalApDetail };
//     });
//     return data;
// };

// export const updateAccProposalAp = async (params: AccProposalAp["id"], form: NewAccProposalAp, formDetail: NewAccProposalApDetail[], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [updatedProposalAp] = await trx.update(acc_proposal_ap).set(form).where(eq(acc_proposal_ap.id, params)).returning();
//         // const updatedProposalApDetail = await trx.update(acc_proposal_ap_detail).set(formDetail).where(eq(acc_proposal_ap_detail.id, params)).returning();
//         const updatedProposalApDetail = await trx.transaction(async (trx2) => {
//             await trx2.delete(acc_proposal_ap_detail).where(eq(acc_proposal_ap_detail.id, params));
//             if (formDetail.length === 0 || !formDetail) {
//                 return [];
//             }
//             return await trx2
//                 .insert(acc_proposal_ap_detail)
//                 .values(
//                     formDetail.map((item) => {
//                         return {
//                             ...item,
//                             id: updatedProposalAp.id,
//                         };
//                     }),
//                 )
//                 .returning();
//         });
//         return { ...updatedProposalAp, detail: updatedProposalApDetail };
//     });
//     // const [data] = await db
//     //   .update(acc_proposal_ap)
//     //   .set(form)
//     //   .where(eq(acc_proposal_ap.id, params))
//     //   .returning();
//     return data;
// };

// export const deleteAccProposalAp = async (id: AccProposalAp["id"], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [check] = await trx.select({ id: acc_proposal_ap.id, status: acc_proposal_ap.status }).from(acc_proposal_ap).where(eq(acc_proposal_ap.id, id));
//         if (check && check.status !== "D") {
//             throw ValidationError("Proposal AP tidak dapat dihapus karena statusnya bukan Draft");
//         }
//         const deletedAccProposalApDetail = await trx.delete(acc_proposal_ap_detail).where(eq(acc_proposal_ap_detail.id, id));
//         const [deletedAccProposalAp] = await trx.delete(acc_proposal_ap).where(eq(acc_proposal_ap.id, id)).returning();
//         return { ...deletedAccProposalAp, detail: deletedAccProposalApDetail };
//     });
//     return data;
// };

// export const getAccProposalApDetail = async ({ id_kontak }: { id_kontak?: number }, tx = db) => {
//     let query = tx.select().from(acc_proposal_ap_detail);
//     if (id_kontak) {
//         query.where(and(eq(acc_proposal_ap_detail.id_kontak, id_kontak), gt(sql`grandtotal - bayar`, 0)));
//     }
//     const data = await query;

//     return data;
// };

// export const getAccProposalApDetailById = async (params: AccProposalApDetail["id"], tx = db) => {
//     const [data] = await tx.select().from(acc_proposal_ap_detail).where(eq(acc_proposal_ap_detail.id, params));
//     return data;
// };

// export const createAccProposalApDetail = async (params: NewAccProposalApDetail, tx = db) => {
//     const [data] = await tx.insert(acc_proposal_ap_detail).values(params).returning();
//     return data;
// };

// export const updateAccProposalApDetail = async (params: AccProposalApDetail["id"], form: NewAccProposalApDetail, tx = db) => {
//     const [data] = await db.update(acc_proposal_ap_detail).set(form).where(eq(acc_proposal_ap_detail.id, params)).returning();
//     return data;
// };

// export const deleteAccProposalApDetail = async (id: AccProposalApDetail["id"], tx = db) => {
//     const [data] = await tx.delete(acc_proposal_ap_detail).where(eq(acc_proposal_ap_detail.id, id)).returning();
//     return data;
// };
