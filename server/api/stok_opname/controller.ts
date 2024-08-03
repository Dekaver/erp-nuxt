// import { sql, eq } from "drizzle-orm";
// import { NextFunction, Request, Response } from "express";
// import { MyRequest } from "../../middleware/authMiddleware";
// import { stok_opname_detail, insertStokOpnameDetailSchema, StokOpnameDetail } from "./detail/schema";
// import { stok_opname, insertStokOpnameSchema, updateStokOpnameSchema } from "./schema";
// import { stok_barang_opname, insertStokBarangOpnameSchema } from "./stok_barang_opname/schema";
// import { createStokOpname, getStokOpname, getStokOpnameById, nomorStokOpname, updateStokOpname } from "./service";
// 
// import xlsx from "xlsx";
// import { createStokOpnameDetail, deleteStokOpnameDetail, getStokOpnameDetailById } from "./detail/service";
// import { insertStokBarangSchema, updateStokBarangSchema } from "../gudang/stok_barang/schema";
// import { createStokBarang, getHPPByIdBarang, getStokBarang, getStokBarangById, getStokBarangByIdBarang, kurangStokBarang } from "../gudang/stok_barang/service";
// import { createStokBarangOpname, deleteStokBarangOpname } from "./stok_barang_opname/service";
// import { getBarangById } from "../barang/service";
// import { updateStokValue } from "../gudang/stok_value/service";
// import { updateStokHarian } from "../gudang/stok_harian/service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getStokOpname();

//         res.status(200).json({
//             message: "Success get stok opname data",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             const data = await getStokOpnameById(id, tx);
//             const dataDetail = await getStokOpnameDetailById(id, tx);
//             return { ...data, detail: dataDetail };
//         });
//         res.status(200).json({
//             message: "Success get stok opname data by id",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;
//         const data = await db.transaction(async (tx) => {
//             const nomorFix = await nomorStokOpname(rest.tanggal, tx);

//             const dataBarang = await getStokBarang(rest, tx);
//             const tanggal = new Date();

//             const validate = insertStokOpnameSchema.parse({
//                 ...rest,
//                 nomor: nomorFix,
//                 tanggal: formatDate(tanggal),
//                 status: "D",
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });
//             const data = await createStokOpname(validate, tx);

//             const validateDetail = dataBarang.map((barang, index) => {
//                 return insertStokOpnameDetailSchema.parse({
//                     id: data.id,
//                     urut: index + 1,
//                     id_barang: barang.id,
//                     id_gudang: rest.id_gudang,
//                     qty: "0",
//                     qty_stok: barang.jumlah_stok,
//                     selisih: `${barang.jumlah_stok * -1}`,
//                     isi_satuan: "1",
//                     created_by: req.user?.id,
//                     updated_by: req.user?.id,
//                 });
//             });

//             const dataDetail = await createStokOpnameDetail(validateDetail, tx);

//             let i = 0;
//             for (const dataStokOpname of dataDetail) {
//                 const dataStok = await getStokBarangByIdBarang(dataStokOpname.id_barang, dataStokOpname.id_gudang, tx);

//                 const validateStokBarangOpname = dataStok.map((stok, j) => {
//                     return insertStokBarangOpnameSchema.parse({
//                         id: dataStokOpname.id,
//                         urut: ++i,
//                         id_barang: stok.id_barang,
//                         id_gudang: rest.id_gudang,
//                         id_stok: stok.id,
//                         id_reff: stok.id_reff,
//                         stok: stok.stok,
//                         stok_awal: stok.stok_awal,
//                         tanggal: formatDate(stok.tanggal),
//                         hpp: stok.hpp,
//                         reff: data.nomor,
//                     });
//                 });

//                 if (validateStokBarangOpname.length > 0) {
//                     await createStokBarangOpname(validateStokBarangOpname, tx);
//                 }
//             }
//             return data;
//         });
//         res.status(200).json({
//             message: "Success create stok opname",
//             data: data,
//         });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { detail, ...rest } = req.body;
//         const id = parseInt(req.params.id);

//         const data = await db.transaction(async (tx) => {
//             const [searchID] = await tx.select().from(stok_opname).where(eq(stok_opname.id, id));
//             if (!searchID) {
//                 throw ValidationError("Data tidak ditemukan");
//             }

//             if (rest.status == "D") {
//                 const validate = updateStokOpnameSchema.parse({
//                     ...rest,
//                 });

//                 const data = await updateStokOpname(id, validate, tx);

//                 const validateDetail = detail.map((item: StokOpnameDetail, index: number) => {
//                     return insertStokOpnameDetailSchema.parse({
//                         ...item,
//                         qty: ToString(item.qty),
//                         qty_stok: ToString(item.qty_stok),
//                         selisih: ToString(item.selisih),
//                     });
//                 });
//                 await deleteStokOpnameDetail(id, tx);
//                 const dataDetail = createStokOpnameDetail(validateDetail, tx);

//                 return { ...data, detail: dataDetail };
//             }

//             if (rest.status == "C") {
//                 const validate = updateStokOpnameSchema.parse({
//                     ...rest,
//                     approved_by: req.user?.id,
//                 });

//                 const data = await updateStokOpname(id, validate, tx);

//                 const validateDetail = detail.map((item: StokOpnameDetail, index: number) => {
//                     return insertStokOpnameDetailSchema.parse({
//                         ...item,
//                         qty: ToString(item.qty),
//                         qty_stok: ToString(item.qty_stok),
//                         selisih: ToString(item.selisih),
//                     });
//                 });

//                 await deleteStokOpnameDetail(id, tx);
//                 const dataDetail = await createStokOpnameDetail(validateDetail, tx);

//                 await deleteStokBarangOpname(id, tx);

//                 let i = 0;
//                 for (const dataStokOpname of dataDetail) {
//                     const dataStok = await getStokBarangByIdBarang(dataStokOpname.id_barang, dataStokOpname.id_gudang, tx);
//                     const validateStokBarangOpname = dataStok.map((stok, j) => {
//                         return insertStokBarangOpnameSchema.parse({
//                             id: dataStokOpname.id,
//                             urut: ++i,
//                             id_barang: stok.id_barang,
//                             id_gudang: rest.id_gudang,
//                             id_stok: stok.id,
//                             id_reff: stok.id_reff,
//                             stok: stok.stok,
//                             stok_awal: stok.stok_awal,
//                             tanggal: formatDate(stok.tanggal),
//                             hpp: stok.hpp,
//                             reff: data.nomor,
//                         });
//                     });

//                     if (validateStokBarangOpname.length > 0) {
//                         await createStokBarangOpname(validateStokBarangOpname, tx);
//                     }
//                 }

//                 const dataDetailSelected = dataDetail.filter((detail) => detail.is_selected);

//                 for (const d of dataDetailSelected) {
//                     const dataBarang = await getBarangById(d.id_barang, tx);
//                     // ambil barang cek is_stok true
//                     if (!dataBarang.is_stok) {
//                         return;
//                     }
//                     //jika is stok true kurangi stok barang
//                     if (parseFloat(d.selisih) < 0) {
//                         const validate = updateStokBarangSchema.parse({
//                             id_gudang: rest.id_gudang,
//                             id_barang: d.id_barang,
//                             stok: (parseFloat(d.selisih) * -1).toString(),
//                             stok_awal: (parseFloat(d.selisih) * -1).toString(),
//                             updated_by: req.user?.id,
//                         });

//                         await kurangStokBarang([validate], "FIFO", tx);
//                     } else if (parseFloat(d.selisih) > 0) {
//                         // create stok barang
//                         const hpp = await getHPPByIdBarang({ id_barang: d.id_barang, id_gudang: d.id_gudang, tanggal: data.tanggal as string }, tx);

//                         //TODO: HPP < 0 throw
//                         const validate = insertStokBarangSchema.parse({
//                             id_gudang: rest.id_gudang,
//                             id_barang: d.id_barang,
//                             stok: d.selisih,
//                             stok_awal: d.selisih,
//                             tanggal: formatDate(rest.tanggal),
//                             reff: "OP",
//                             id_reff: id,
//                             hpp: hpp,
//                             created_by: req.user?.id,
//                             updated_by: req.user?.id,
//                         });

//                         await createStokBarang(validate, tx);
//                     }
//                     await updateStokValue(formatDate(rest.tanggal), rest.id_gudang, d.id_barang, d.selisih, tx);

//                     await updateStokHarian(formatDate(rest.tanggal), rest.id_gudang, d.id_barang, d.selisih, tx);
//                 }
//                 return { ...data, detail: dataDetail };
//             }
//         });

//         res.status(200).json({
//             message: "Success update stok opname",
//             data: data,
//         });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const data = await db.transaction(async (tx) => {
//             const [dataStokOpname] = await tx
//                 .select()
//                 .from(stok_opname)
//                 .where(eq(stok_opname.id, parseInt(id)));
//             if (!dataStokOpname) {
//                 throw ValidationError("Data tidak ditemukan");
//             }
//             if (dataStokOpname.status != "D") {
//                 throw ValidationError("Stok Opname Tidak dapat dihapus.");
//             }

//             await tx.delete(stok_barang_opname).where(eq(stok_barang_opname.id, parseInt(id)));
//             await tx.delete(stok_opname_detail).where(eq(stok_opname_detail.id, parseInt(id)));
//             const [data] = await tx
//                 .delete(stok_opname)
//                 .where(eq(stok_opname.id, parseInt(id)))
//                 .returning();
//             return data;
//         });
//         res.status(200).json({
//             message: "Success delete stok opname",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export async function importExcel(req: MyRequest, res: Response, next: NextFunction) {
//     try {
//         const data = await db.transaction(async (tx) => {
//             const file = req.file;

//             const { id } = req.params;

//             if (!file) {
//                 throw ValidationError("File is required");
//             }
//             const workbook = xlsx.readFile(file.path);
//             const sheetName = workbook.SheetNames[0];
//             const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
//                 header: 1,
//             });

//             const data_stok_opname = sheetData.slice(2, 6) as any[];
//             const tanggal_stok_opname = data_stok_opname[1][2];

//             // Skip the first 8 rows (company data)
//             const dataFromRow8ToEnd: any = sheetData.slice(7);

//             // Extract the header row (row 8)
//             const headerRow = dataFromRow8ToEnd.shift() as any[];

//             // Combine each data row with the header row to form an array of objects
//             const formattedData = dataFromRow8ToEnd.map((row: any) => Object.fromEntries(headerRow.map((header, index) => [header, row[index]])));
//             const [stokOpname] = await tx
//                 .select()
//                 .from(stok_opname)
//                 .where(eq(stok_opname.id, parseInt(id)));
//             const resultObject = {} as any;

//             data_stok_opname.forEach((item) => {
//                 const key = item[0].toLowerCase();
//                 const value = item[2];

//                 resultObject[key] = value;
//             });
//             if (resultObject.nomor == stokOpname.nomor) {
//                 await tx
//                     .update(stok_opname)
//                     .set({
//                         status: "U",
//                         upload_by: req.user?.id,
//                         upload_at: new Date().toString(),
//                         qty_upload: stokOpname.qty_upload + 1,
//                     })
//                     .where(eq(stok_opname.id, parseInt(id)));
//                 for (let i = 0; i < formattedData.length; i++) {
//                     const data = formattedData[i];
//                     const update_stok_barang = await tx.execute(
//                         sql.raw(`UPDATE stok_opname_detail as a 
//                     SET 
//                       qty=${data["Kuantitas Fisik"]} , 
//                       selisih=${data["Kuantitas Fisik"]}-qty_stok, 
//                       notes='${!data["Keterangan"] ? "" : data["Keterangan"]}'
//                     FROM barang b
//                       WHERE b.id=a.id_barang 
//                         AND a.id=${id}
//                         AND b.kode_barang='${data["Kode Barang"]}'`),
//                     );
//                 }
//             } else {
//                 throw ValidationError("Stok Opname Not Match");
//             }
//             return;
//         });
//         res.status(200).json({
//             message: "Success import stok opname data",
//         });
//     } catch (error) {
//         next(error);
//     }
// }
