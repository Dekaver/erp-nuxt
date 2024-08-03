// import { NextFunction, Request, Response } from "express";
// import {
//     createBarang,
//     deleteBarang,
//     getBarang,
//     getBarangById,
//     getBarangSatuanByIdBarang,
//     updateBarang,
//     getBarangWithStok,
//     createBarangSatuan,
//     deleteBarangSatuan,
//     getBarangWithOptionSatuan,
//     createBahanBaku,
//     createBiaya,
//     deleteBahanBaku,
//     deleteBiaya,
//     getBarangWithOptionSatuanByIdBarang,
// } from "../barang/service";
// import { NewBarangBahanBaku, NewBarangBiaya, NewBarangSatuan, insertBarangBahanBakuSchema, insertBarangBiayaSchema, insertBarangSatuanSchema, insertBarangSchema } from "./schema";
// import { MyRequest } from "src/middleware/authMiddleware";

// import { getHPPByIdBarang } from "../gudang/stok_barang/service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getBarang();
//         return res.status(200).json({
//             message: "Success Get Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getOption = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getBarangWithOptionSatuan();
//         return res.status(200).json({
//             message: "Success Get Option Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getHppBarangByIdBarang = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id_barang = parseInt(req.query.id_barang as string);
//         const id_gudang = parseInt(req.query.id_gudang as string);
//         const data = await getHPPByIdBarang({ id_barang, id_gudang });
//         return res.status(200).json({
//             message: "Success Get HPP Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexWithStok = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getBarangWithStok();
//         res.status(200).json({
//             message: "Success Get Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getBarangById(req.user!.id);
//         return res.status(200).json({
//             message: "Success Get Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getSatuan = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const data = await getBarangSatuanByIdBarang(parseInt(id));
//         return res.status(200).json({
//             message: "Success Get Satuan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id, harga_jual, harga_beli, satuan_data, biaya, bahan_baku, is_dijual, is_dibeli, ...rest } = req.body;

//         const data = await db.transaction(async (tx) => {
//             const validate = insertBarangSchema.parse({
//                 ...rest,
//                 is_dijual: is_dijual,
//                 harga_jual: is_dijual ? harga_jual.toString() : "0",
//                 is_dibeli: is_dibeli,
//                 harga_beli: is_dibeli ? harga_beli.toString() : "0",
//                 id_account_harga_beli: is_dibeli && !rest.is_stok ? rest.id_account_harga_beli : null,
//             });

//             const data = await createBarang(validate, tx);

//             if (satuan_data != null && satuan_data.length != 0) {
//                 const validateSatuan: NewBarangSatuan[] = satuan_data.map((item: NewBarangSatuan) => {
//                     if (data.id_satuan == item.id_satuan) {
//                         throw ValidationError("Satuan kiri dan Kanan Tidak Boleh sama");
//                     }
//                     return insertBarangSatuanSchema.parse({
//                         id_satuan: item.id_satuan,
//                         id_barang: data.id,
//                         konversi: ToString(item.konversi),
//                     });
//                 });
//                 const dataSatuan = await createBarangSatuan(validateSatuan, tx);
//             }

//             if (rest.is_bundling == true) {
//                 if (bahan_baku != null && bahan_baku.length != 0) {
//                     const validateBahanBaku: NewBarangBahanBaku[] = bahan_baku.map((item: NewBarangBahanBaku, index: number) => {
//                         return insertBarangBahanBakuSchema.parse({
//                             id: data.id,
//                             id_barang: item.id_barang,
//                             urut: index + 1,
//                             qty: ToString(item.qty),
//                             harga_beli: ToString(item.harga_beli),
//                         });
//                     });
//                     const dataBahanBaku = await createBahanBaku(validateBahanBaku, tx);
//                 }

//                 if (biaya != null && biaya.length != 0) {
//                     const validateBiaya: NewBarangBiaya[] = biaya.map((item: NewBarangBiaya, index: number) => {
//                         return insertBarangBiayaSchema.parse({
//                             id_account: item.id_account,
//                             id: data.id,
//                             urut: index + 1,
//                             biaya: ToString(item.biaya),
//                         });
//                     });
//                     const dataBiaya = await createBiaya(validateBiaya, tx);
//                 }
//             }
//             return data;
//         });

//         return res.status(200).json({
//             message: "Success Create Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { harga_jual, harga_beli, satuan_data, bahan_baku, biaya, is_dijual, is_dibeli, ...rest } = req.body;
//         const data = await db.transaction(async (tx) => {
//             const validate = insertBarangSchema.parse({
//                 ...rest,
//                 is_dijual: is_dijual,
//                 harga_jual: is_dijual ? harga_jual.toString() : "0",
//                 is_dibeli: is_dibeli,
//                 harga_beli: is_dibeli ? harga_beli.toString() : "0",
//                 id_account_harga_beli: is_dibeli && !rest.is_stok ? rest.id_account_harga_beli : null,
//             });

//             const data = await updateBarang(parseInt(req.params.id), validate, tx);

//             const deleteDetail = await deleteBarangSatuan(data.id, tx);
//             const deleteBiayaDetail = await deleteBiaya(data.id, tx);
//             const deleteBahanBakuDetail = await deleteBahanBaku(data.id, tx);

//             if (satuan_data != null && satuan_data.length != 0) {
//                 const validateSatuan: NewBarangSatuan[] = satuan_data.map((item: NewBarangSatuan) => {
//                     if (data.id_satuan == item.id_satuan) {
//                         throw ValidationError("Satuan kiri dan Kanan Tidak Boleh sama");
//                     }
//                     return insertBarangSatuanSchema.parse({
//                         id_satuan: item.id_satuan,
//                         id_barang: data.id,
//                         konversi: ToString(item.konversi),
//                     });
//                 });
//                 const dataSatuan = await createBarangSatuan(validateSatuan, tx);
//             }

//             if (rest.is_bundling == true) {
//                 if (bahan_baku != null && bahan_baku.length != 0) {
//                     const validateBahanBaku: NewBarangBahanBaku[] = bahan_baku.map((item: NewBarangBahanBaku, index: number) => {
//                         return insertBarangBahanBakuSchema.parse({
//                             id: data.id,
//                             id_barang: item.id_barang,
//                             urut: index + 1,
//                             qty: ToString(item.qty),
//                             harga_beli: ToString(item.harga_beli),
//                         });
//                     });
//                     const dataBahanBaku = await createBahanBaku(validateBahanBaku, tx);
//                 }

//                 if (biaya != null && biaya.length != 0) {
//                     const validateBiaya: NewBarangBiaya[] = biaya.map((item: NewBarangBiaya, index: number) => {
//                         return insertBarangBiayaSchema.parse({
//                             id_account: item.id_account,
//                             id: data.id,
//                             urut: index + 1,
//                             biaya: ToString(item.biaya),
//                         });
//                     });
//                     const dataBiaya = await createBiaya(validateBiaya, tx);
//                 }
//             }

//             return data;
//         });

//         return res.status(200).json({
//             message: "Success Update Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteBarang(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const showWithOptionSatuan = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getBarangWithOptionSatuanByIdBarang(req.params.id as unknown as number);
//         return res.status(200).json({
//             message: "Success Get Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
