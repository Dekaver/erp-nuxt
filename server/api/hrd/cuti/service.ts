// import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";

// import { jabatan } from "../../jabatan/schema";
// import { pegawai } from "../../pegawai/schema";
// import {
//     Cuti,
//     CutiEmployeeColumns,
//     CutiJabatanColumns,
//     CutiSub,
//     NewCuti,
//     NewCutiJabatan,
//     NewCutiSub,
//     cuti,
//     cutiApproval,
//     cutiEmployee,
//     cutiJabatan,
//     cutiMaster,
//     cutiSub
// } from "./schema";

// export const get = async (userId: number, status?: any, tx = db) => {
//     const query = tx
//         .select({
//             ...CutiEmployeeColumns,
//             status: cutiApproval.status,
//             jenis_cuti: cutiMaster.nama_master,
//             nama: pegawai.nama,
//             email: pegawai.email,
//         })
//         .from(cutiEmployee)
//         .innerJoin(cutiApproval, eq(cutiEmployee.id, cutiApproval.id_cuti_karyawan))
//         .innerJoin(cutiMaster, eq(cutiEmployee.id_cuti, cutiMaster.id))
//         .innerJoin(pegawai, eq(cutiEmployee.id_pegawai, pegawai.id));

//     if (status == "A") {
//         query.where(eq(cutiEmployee.id_pegawai, userId));
//     } else {
//         if (status !== undefined && status !== null) {
//             query.where(and(eq(cutiEmployee.id_pegawai, userId), eq(cutiApproval.status, status)));
//         } else {
//             query.where(and(eq(cutiEmployee.id_pegawai, userId), isNull(cutiApproval.status)));
//         }
//     }

//     const data = await query.orderBy(desc(cutiEmployee.create_date));

//     return data;
// };

// // get all employee cuti for approval cuti list
// export const getApproval = async (status?: any, tx = db) => {
//     const query = tx
//         .select({
//             ...CutiEmployeeColumns,
//             status: cutiApproval.status,
//             jenis_cuti: cutiMaster.nama_master,
//             nama: pegawai.nama,
//             email: pegawai.email,
//         })
//         .from(cutiEmployee)
//         .innerJoin(cutiApproval, eq(cutiEmployee.id, cutiApproval.id_cuti_karyawan))
//         .innerJoin(cutiMaster, eq(cutiEmployee.id_cuti, cutiMaster.id))
//         .innerJoin(pegawai, eq(cutiEmployee.id_pegawai, pegawai.id));

//     if (status == "A") {
//     } else {
//         if (status !== undefined && status !== null) {
//             query.where(eq(cutiApproval.status, status));
//         } else {
//             query.where(isNull(cutiApproval.status));
//         }
//     }

//     const data = await query.orderBy(desc(cutiEmployee.create_date));

//     return data;
// };

// export const getById = async (idCuti: number, tx = db) => {
//     const [data] = await tx
//         .select({
//             ...CutiEmployeeColumns,
//             status: cutiApproval.status,
//             jenis_cuti: cutiMaster.nama_master,
//             nama: pegawai.nama,
//             email: pegawai.email,
//             jabatan: jabatan.jabatan,
//         })
//         .from(cutiEmployee)
//         .innerJoin(cutiApproval, eq(cutiEmployee.id, cutiApproval.id_cuti_karyawan))
//         .innerJoin(cutiMaster, eq(cutiEmployee.id_cuti, cutiMaster.id))
//         .innerJoin(pegawai, eq(cutiEmployee.id_pegawai, pegawai.id))
//         .innerJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id))
//         .where(eq(cutiEmployee.id, idCuti));

//     return data;
// };

// export const getMaster = async (tx = db) => {
//     const data = await tx.select().from(cutiMaster);
//     return data;
// };

// export const getSub = async (idCuti: number, tx = db) => {
//     const data = await tx.select().from(cutiSub).where(eq(cutiSub.id_cuti, idCuti));
//     return data;
// };

// export const create = async (req: any, foto: any, tx = db) => {
//     const currentDate = new Date();
//     const formattedDate = currentDate.toISOString().split("T")[0];
//     const { waktu_cuti, tanggal_awal, tanggal_akhir, telepon, alasan, id_cuti, id_cuti_sub } = req.body;

//     let cutiCreated;
//     if (foto != undefined) {
//         cutiCreated = await tx.execute(
//             sql.raw(`INSERT INTO 
//             hr.cuti_karyawan(
//                 waktu_cuti,
//                 tanggal_awal,
//                 tanggal_akhir,
//                 telpon,
//                 alasan,
//                 create_by,
//                 create_date,
//                 id_cuti,
//                 id_cuti_sub,
//                 id_pegawai,
//                 foto_bukti
//             ) VALUES (
//                 '${waktu_cuti}',
//                 '${tanggal_awal}',
//                 ${tanggal_akhir ? "'" + tanggal_akhir + "'" : null},
//                 '${telepon}',
//                 '${alasan}',
//                 '${req.user.id}',
//                 '${formattedDate}',
//                 '${id_cuti}',
//                 ${id_cuti_sub ? "'" + id_cuti_sub + "'" : null},
//                 '${req.user.id}',
//                 '${foto}'
//             ) RETURNING id;`),
//         );
//     } else {
//         cutiCreated = await tx.execute(
//             sql.raw(`INSERT INTO 
//             hr.cuti_karyawan(
//                 waktu_cuti,
//                 tanggal_awal,
//                 tanggal_akhir,
//                 telpon,
//                 alasan,
//                 create_by,
//                 create_date,
//                 id_cuti,
//                 id_cuti_sub,
//                 id_pegawai
//             ) VALUES (
//                 '${waktu_cuti}',
//                 '${tanggal_awal}',
//                 ${tanggal_akhir ? "'" + tanggal_akhir + "'" : null},
//                 '${telepon}',
//                 '${alasan}',
//                 '${req.user.id}',
//                 '${formattedDate}',
//                 '${id_cuti}',
//                 ${id_cuti_sub ? "'" + id_cuti_sub + "'" : null},
//                 '${req.user.id}'
//             ) RETURNING id;`),
//         );
//     }

//     const [getPegawaiAtasan] = await tx.select({ atasan_langsung: pegawai.atasan_langsung }).from(pegawai).where(eq(req.user.id, pegawai.id));

//     await tx.execute(
//         sql.raw(`INSERT INTO 
//         hr.cuti_persetujuan(
//           id_cuti_karyawan,
//           id_pegawai,
//           urut
//         ) VALUES (
//           ${cutiCreated[0].id},
//           ${getPegawaiAtasan.atasan_langsung},
//           0
//         ) RETURNING id_pegawai`),
//     );

//     return cutiCreated[0].id;
// };

// export const approveCuti = async (req: any, tx = db) => {
//     const { id } = req.params;
//     const { is_approve } = req.body;

//     console.log(req.params.id);

//     const [getCutiKaryawan] = await tx.select().from(cutiEmployee).where(eq(cutiEmployee.id, id));

//     const [getCutiName] = await tx.select().from(cutiMaster).where(eq(cutiMaster.id, getCutiKaryawan.id_cuti));

//     if (is_approve === true) {
//         await tx.execute(
//             sql.raw(`UPDATE 
//             hr.cuti_persetujuan 
//           SET 
//             status=${is_approve},
//             tanggal_persetujuan = CURRENT_DATE 
//           WHERE 
//             id_cuti_karyawan=${id};`),
//         );

//         if (getCutiKaryawan.tanggal_akhir == null) {
//             await tx.execute(
//                 sql.raw(`INSERT INTO 
//                 hr.absen(
//                   tanggal,
//                   keterangan, 
//                   id_absen, 
//                   overtimebefore, 
//                   overtimeafter,
//                   id_cuti,
//                   schedule)
//               VALUES 
//                 ('${formatDateString(getCutiKaryawan.tanggal_awal, "yyyy-MM-dd")}',
//                 '${getCutiName.nama_master}', 
//                 '${getCutiKaryawan.id_pegawai}', 
//                 0, 
//                 0,
//                 ${id},
//                 'o');`),
//             );
//         } else {
//             const differenceInDay = dateDiffInDays(getCutiKaryawan.tanggal_awal, getCutiKaryawan.tanggal_akhir);

//             // for-loop each days cuti into absen
//             // *keterangan will be same as nama_master
//             for (let i = 0; i < differenceInDay + 1; i++) {
//                 const createAbsen = `
//                   INSERT INTO 
//                     hr.absen(
//                       tanggal,
//                       keterangan, 
//                       id_absen, 
//                       overtimebefore, 
//                       overtimeafter,
//                       id_cuti,
//                       schedule)
//                   VALUES 
//                     ('${addDaysToDate(getCutiKaryawan.tanggal_awal, i)}',
//                     '${getCutiName.nama_master}', 
//                     ${getCutiKaryawan.id_pegawai}, 
//                     0, 
//                     0,
//                     ${id},
//                     'o');`;
//                 await tx.execute(sql.raw(createAbsen));
//             }
//         }
//         return getCutiKaryawan.id;
//     } else {
//         await tx.execute(
//             sql.raw(`UPDATE 
//             hr.cuti_persetujuan 
//           SET 
//             status=${is_approve} 
//           WHERE 
//             id_cuti_karyawan=${id}`),
//         );
//         return getCutiKaryawan.id;
//     }
// };

// // ===== HELPER ====

// // Add days to date object
// function addDaysToDate(date: Date | string, daysToAdd: number): string {
//     const result = new Date(date);
//     result.setDate(result.getDate() + daysToAdd);
//     return formatDate(result);
// }

// // Calculate the difference in days between two dates
// function dateDiffInDays(date1: Date | string, date2: Date | string): number {
//     // Convert the dates to Date objects if they are not already.
//     const convertedDate1 = typeof date1 === "string" ? new Date(date1) : date1;
//     const convertedDate2 = typeof date2 === "string" ? new Date(date2) : date2;

//     // Calculate the time difference in milliseconds.
//     const timeDiff = Math.abs(convertedDate2.getTime() - convertedDate1.getTime());

//     // Calculate the number of days in the time difference.
//     const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

//     return daysDiff;
// }

// // Format date into yyyy-MM-dd
// function formatDate(date: Date): string {
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add 1 to month since it's zero-based
//     const day = date.getDate().toString().padStart(2, "0");

//     return `${year}-${month}-${day}`;
// }

// function formatDateString(inputDate: string, outputFormat: string): string {
//     const date = new Date(inputDate);

//     if (isNaN(date.getTime())) {
//         throw new Error("Invalid date string");
//     }

//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     const hours = date.getHours().toString().padStart(2, "0");
//     const minutes = date.getMinutes().toString().padStart(2, "0");
//     const seconds = date.getSeconds().toString().padStart(2, "0");

//     const formattedDate = outputFormat.replace("yyyy", year.toString()).replace("MM", month).replace("dd", day).replace("HH", hours).replace("mm", minutes).replace("ss", seconds);

//     return formattedDate;
// }

// // GET JABATAN THAT DOES NOT APPEAR IN hr.cuti_jabatan
// export const getCutiJabatan = async (tx = db) => {
//     const data = await tx
//         .select({
//             id: jabatan.id,
//             nama: jabatan.jabatan,
//         })
//         .from(jabatan)
//         .leftJoin(cutiJabatan, eq(cutiJabatan.id_jabatan, jabatan.id))
//         .where(isNull(cutiJabatan.id_jabatan))
//         .orderBy(asc(jabatan.jabatan));

//     return data;
// };

// export const createCutiJabatan = async (form: NewCutiJabatan[], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [data] = await trx.insert(cutiJabatan).values(form).returning();
//         return data;
//     });
//     return data;
// };

// export const createCutiMaster = async (form: NewCuti, tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [data] = await trx.insert(cuti).values(form).returning();

//         return data;
//     });
//     return data;
// };

// export const createSubCuti = async (form: NewCutiSub, tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [data] = await trx.insert(cutiSub).values(form).returning();

//         return data;
//     });
//     return data;
// };

// export const getKebijakanCuti = async (tx = db) => {
//     const data = await tx.select().from(cuti);

//     let result = [];
//     for (let index = 0; index < data.length; index++) {
//         const i = data[index];
//         const dataSubCuti = await tx.select().from(cutiSub).where(eq(cutiSub.id_cuti, i.id));
//         const dataCutiJabatan = await tx
//             .select({
//                 ...CutiJabatanColumns,
//                 jabatan: jabatan.jabatan,
//             })
//             .from(cutiJabatan)
//             .innerJoin(jabatan, eq(jabatan.id, cutiJabatan.id_jabatan))
//             .where(eq(cutiJabatan.id_cuti, i.id));

//         result.push({
//             ...i,
//             sub_cuti: [...dataSubCuti],
//             cuti_jabatan: [...dataCutiJabatan],
//         });
//     }

//     return result;
// };

// export const getKebijakanCutiById = async (id: number, tx = db) => {
//     const [data] = await tx.select().from(cuti).where(eq(cuti.id, id));
//     const dataSubCuti = await tx.select().from(cutiSub).where(eq(cutiSub.id_cuti, data.id));

//     const dataCutiJabatan = await tx
//         .select({
//             id: jabatan.id,
//             nama: jabatan.jabatan,
//         })
//         .from(cutiJabatan)
//         .innerJoin(jabatan, eq(jabatan.id, cutiJabatan.id_jabatan))
//         .where(eq(cutiJabatan.id_cuti, data.id));

//     return {
//         ...data,
//         sub_cuti: [...dataSubCuti],
//         cuti_jabatan: [...dataCutiJabatan],
//     };
// };

// export const deleteCuti = async (id: Cuti["id"], tx = db) => {
//     const [data] = await tx.delete(cuti).where(eq(cuti.id, id)).returning();
//     return data;
// };

// export const deleteSubCuti = async (id: Cuti["id"], tx = db) => {
//     const [data] = await tx.delete(cutiSub).where(eq(cutiSub.id_cuti, id)).returning();
//     return data;
// };

// export const deleteSubCutiById = async (id: number, tx = db) => {
//     const [data] = await tx.delete(cutiSub).where(eq(cutiSub.id, id)).returning();
//     return data;
// };

// export const deleteCutiJabatan = async (id: Cuti["id"], tx = db) => {
//     const [data] = await tx.delete(cutiJabatan).where(eq(cutiJabatan.id_cuti, id)).returning();
//     return data;
// };

// export const updateCutiSub = async (params: CutiSub["id"], form: NewCutiSub, tx = db) => {
//     const [data] = await tx.update(cutiSub).set(form).where(eq(cutiSub.id, params)).returning();
//     return data;
// };

// export const updateKebijakanCuti = async (params: Cuti["id"], form: NewCuti, tx = db) => {
//     const [data] = await tx.update(cuti).set(form).where(eq(cuti.id, params)).returning();
//     return data;
// };
