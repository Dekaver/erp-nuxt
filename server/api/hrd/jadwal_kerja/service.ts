// import { asc, eq, isNull } from "drizzle-orm";

// import { jabatan } from "../../jabatan/schema";
// import { pegawai } from "../../pegawai/schema";
// import {
//     JadwalKerja,
//     NewJadwalKerja,
//     NewJadwalKerjaKaryawan,
//     NewJadwalKerjaWaktu,
//     jadwalKerja,
//     jadwalKerjaKaryawan,
//     jadwalKerjaWaktu
// } from "./schema";

// export const getJadwalKerja = async (tx = db) => {
//     const data = await tx.select().from(jadwalKerja);

//     let result = [];
//     for (let index = 0; index < data.length; index++) {
//         const i = data[index];
//         const dataWaktu = await tx.select().from(jadwalKerjaWaktu).where(eq(jadwalKerjaWaktu.id_jadwal_kerja, i.id));
//         const dataPegawai = await tx.select().from(jadwalKerjaKaryawan).where(eq(jadwalKerjaKaryawan.id_jadwal_kerja, i.id));
//         result.push({
//             ...i,
//             waktu: [...dataWaktu],
//             pegawai: [...dataPegawai],
//         });
//     }

//     return result;
// };

// // GET PEGAWAI THAT DOES NOT APPEAR IN hr.jadwal_kerja_karyawan
// export const getPegawaiJadwal = async (tx = db) => {
//     const data = await tx
//         .select({
//             id_pegawai: pegawai.id,
//             nama: pegawai.nama,
//             jabatan: jabatan.jabatan,
//         })
//         .from(pegawai)
//         .leftJoin(jadwalKerjaKaryawan, eq(jadwalKerjaKaryawan.id_pegawai, pegawai.id))
//         .innerJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id))
//         .where(isNull(jadwalKerjaKaryawan.id_jadwal_kerja))
//         .orderBy(asc(pegawai.nama));

//     return data;
// };

// export const getJadwalKerjaById = async (params: JadwalKerja["id"], tx = db) => {
//     const [data] = await tx.select().from(jadwalKerja).where(eq(jadwalKerja.id, params));

//     const dataWaktu = await tx.select().from(jadwalKerjaWaktu).where(eq(jadwalKerjaWaktu.id_jadwal_kerja, data.id));
//     const dataPegawai = await tx
//         .select({
//             id_pegawai: pegawai.id,
//             nama: pegawai.nama,
//             jabatan: jabatan.jabatan,
//         })
//         .from(jadwalKerjaKaryawan)
//         .innerJoin(pegawai, eq(pegawai.id, jadwalKerjaKaryawan.id_pegawai))
//         .innerJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id))
//         .where(eq(jadwalKerjaKaryawan.id_jadwal_kerja, data.id))
//         .orderBy(asc(pegawai.nama));

//     return {
//         ...data,
//         detail: [...dataWaktu],
//         pegawai: [...dataPegawai],
//     };
// };

// export const createJadwalKerja = async (form: NewJadwalKerja, tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [data] = await trx.insert(jadwalKerja).values(form).returning();
//         return data;
//     });
//     return data;
// };

// export const createJadwalWaktu = async (form: NewJadwalKerjaWaktu[], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [data] = await trx.insert(jadwalKerjaWaktu).values(form).returning();
//         return data;
//     });
//     return data;
// };

// export const createJadwalKaryawan = async (form: NewJadwalKerjaKaryawan[], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [data] = await trx.insert(jadwalKerjaKaryawan).values(form).returning();
//         return data;
//     });
//     return data;
// };

// export const updateJadwalKerja = async (params: JadwalKerja["id"], form: NewJadwalKerja, tx = db) => {
//     const [data] = await tx.update(jadwalKerja).set(form).where(eq(jadwalKerja.id, params)).returning();
//     return data;
// };

// export const deleteJadwalKerja = async (id: JadwalKerja["id"], tx = db) => {
//     const [data] = await tx.delete(jadwalKerja).where(eq(jadwalKerja.id, id)).returning();
//     return data;
// };

// export const deleteJadwalWaktu = async (id: JadwalKerja["id"], tx = db) => {
//     const [data] = await tx.delete(jadwalKerjaWaktu).where(eq(jadwalKerjaWaktu.id_jadwal_kerja, id)).returning();
//     return data;
// };

// export const deleteJadwalKaryawan = async (id: JadwalKerja["id"], tx = db) => {
//     const [data] = await tx.delete(jadwalKerjaKaryawan).where(eq(jadwalKerjaKaryawan.id_jadwal_kerja, id)).returning();
//     return data;
// };
