// import { NextFunction, Request, Response } from "express";
// import {
//     createAssembly,
//     deleteAssembly,
//     getAssembly,
//     getAssemblyById,
//     updateAssembly,
//     createBahanBaku,
//     createBiaya,
//     deleteBahanBaku,
//     deleteBiaya,
//     nomorAssembly,
//     updateStok,
// } from "../assembly/service";
// import { NewAssembly, NewAssemblyBahanBaku, NewAssemblyBiaya, insertAssemblyBahanBakuSchema, insertAssemblyBiayaSchema, insertAssemblySchema } from "./schema";
// import { MyRequest } from "src/middleware/authMiddleware";
// 

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAssembly();
//         return res.status(200).json({
//             message: "Success Get Assembly",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAssemblyById(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get Assembly",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { id, qty, total_material, tanggal, total_biaya, biaya_tetap, harga_satuan, total_biaya_tetap, grandtotal, biaya_satuan, bahan_baku, biaya, ...rest } = req.body;

//         const data = await db.transaction(async (tx) => {
//             const nomorFix = await nomorAssembly(rest.tanggal, tx);
//             const validate = insertAssemblySchema.parse({
//                 ...rest,
//                 nomor: nomorFix,
//                 tanggal: formatDate(tanggal),
//                 qty: qty ? qty.toString() : "0",
//                 total_material: total_material ? total_material.toString() : "0",
//                 total_biaya: total_biaya ? total_biaya.toString() : "0",
//                 biaya_tetap: biaya_tetap ? biaya_tetap.toString() : "0",
//                 total_biaya_tetap: total_biaya_tetap ? total_biaya_tetap.toString() : "0",
//                 grandtotal: grandtotal ? grandtotal.toString() : "0",
//                 biaya_satuan: biaya_satuan ? biaya_satuan.toString() : "0",
//                 harga_satuan: harga_satuan ? harga_satuan.toString() : "0",
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });

//             const data = await createAssembly(validate, tx);

//             if (bahan_baku != null && bahan_baku.length != 0) {
//                 const validateBahanBaku: NewAssemblyBahanBaku[] = bahan_baku.map((item: NewAssemblyBahanBaku, index: number) => {
//                     return insertAssemblyBahanBakuSchema.parse({
//                         id: data.id,
//                         id_barang: item.id_barang,
//                         id_satuan: item.id_satuan,
//                         urut: index + 1,
//                         qty: ToString(item.qty),
//                         bahan: ToString(item.bahan),
//                         harga_beli: ToString(item.harga_beli),
//                     });
//                 });
//                 const dataBahanBaku = await createBahanBaku(validateBahanBaku, tx);

//                 if (rest.status == "A") {
//                     await updateStok(data, validateBahanBaku, tx);
//                 }
//             }

//             if (biaya != null && biaya.length != 0) {
//                 const validateBiaya: NewAssemblyBiaya[] = biaya.map((item: NewAssemblyBiaya, index: number) => {
//                     return insertAssemblyBiayaSchema.parse({
//                         id_account: item.id_account,
//                         id: data.id,
//                         urut: index + 1,
//                         modal: ToString(item.modal),
//                         biaya: ToString(item.biaya),
//                     });
//                 });
//                 const dataBiaya = await createBiaya(validateBiaya, tx);
//             }

//             return data;
//         });

//         return res.status(200).json({
//             message: "Success Create Assembly",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { id, qty, total_material, total_biaya, tanggal, biaya_tetap, harga_satuan, total_biaya_tetap, grandtotal, biaya_satuan, bahan_baku, biaya, ...rest } = req.body;

//         const data = await db.transaction(async (tx) => {
//             const validate = insertAssemblySchema.parse({
//                 ...rest,
//                 tanggal: formatDate(tanggal),
//                 qty: qty ? qty.toString() : "0",
//                 total_material: total_material ? total_material.toString() : "0",
//                 total_biaya: total_biaya ? total_biaya.toString() : "0",
//                 biaya_tetap: biaya_tetap ? biaya_tetap.toString() : "0",
//                 total_biaya_tetap: total_biaya_tetap ? total_biaya_tetap.toString() : "0",
//                 grandtotal: grandtotal ? grandtotal.toString() : "0",
//                 biaya_satuan: biaya_satuan ? biaya_satuan.toString() : "0",
//                 harga_satuan: harga_satuan ? harga_satuan.toString() : "0",
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });

//             const data = await updateAssembly(parseInt(req.params.id), validate, tx);

//             const deleteBiayaDetail = await deleteBiaya(data.id, tx);
//             const deleteBahanBakuDetail = await deleteBahanBaku(data.id, tx);

//             if (bahan_baku != null && bahan_baku.length != 0) {
//                 const validateBahanBaku: NewAssemblyBahanBaku[] = bahan_baku.map((item: NewAssemblyBahanBaku, index: number) => {
//                     return insertAssemblyBahanBakuSchema.parse({
//                         id: data.id,
//                         id_barang: item.id_barang,
//                         urut: index + 1,
//                         id_satuan: item.id_satuan,
//                         qty: ToString(item.qty),
//                         bahan: ToString(item.bahan),
//                         harga_beli: ToString(item.harga_beli),
//                     });
//                 });
//                 const dataBahanBaku = await createBahanBaku(validateBahanBaku, tx);

//                 if (rest.status == "A") {
//                     await updateStok(data, validateBahanBaku, tx);
//                 }
//             }

//             if (biaya != null && biaya.length != 0) {
//                 const validateBiaya: NewAssemblyBiaya[] = biaya.map((item: NewAssemblyBiaya, index: number) => {
//                     return insertAssemblyBiayaSchema.parse({
//                         id_account: item.id_account,
//                         id: data.id,
//                         urut: index + 1,
//                         modal: ToString(item.modal),
//                         biaya: ToString(item.biaya),
//                     });
//                 });
//                 const dataBiaya = await createBiaya(validateBiaya, tx);
//             }
//             return data;
//         });

//         return res.status(200).json({
//             message: "Success Update Assembly",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteAssembly(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Assembly",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
