// import { NextFunction, Request, Response } from "express";
// import { sql } from "drizzle-orm";

// export const resetDB = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (trx) => {
//             // Delete accounting
//             await trx.execute(sql`DELETE FROM initial_account`);
//             await trx.execute(sql`DELETE FROM acc_gl_detail`);
//             await trx.execute(sql`DELETE FROM acc_gl_trans`);
//             await trx.execute(sql`DELETE FROM acc_kas_detail`);
//             await trx.execute(sql`DELETE FROM acc_kas`);
//             await trx.execute(sql`DELETE FROM acc_value`);

//             await trx.execute(sql`DELETE FROM payment_ap_detail`);
//             await trx.execute(sql`DELETE FROM payment_ap`);
//             // Delete proposal ap
//             await trx.execute(sql`DELETE FROM acc_proposal_ap_detail`);
//             await trx.execute(sql`DELETE FROM acc_proposal_ap`);
//             // Delete ap
//             await trx.execute(sql`DELETE FROM acc_ap_faktur`);
//             await trx.execute(sql`DELETE FROM ap_detail`);
//             await trx.execute(sql`DELETE FROM ap_penerimaan_barang`);
//             await trx.execute(sql`DELETE FROM ap`);

//             await trx.execute(sql`DELETE FROM stok_barang`);
//             await trx.execute(sql`DELETE FROM stok_value`);

//             await trx.execute(sql`DELETE FROM penerimaan_barang_detail`);
//             await trx.execute(sql`DELETE FROM penerimaan_barang`);

//             await trx.execute(sql`DELETE FROM purchase_order_setting`);
//             await trx.execute(sql`DELETE FROM purchase_order_persetujuan`);
//             await trx.execute(sql`DELETE FROM purchase_order_detail`);
//             await trx.execute(sql`DELETE FROM purchase_order`);
            
//             await trx.execute(sql`DELETE FROM purchase_request_setting`);
//             await trx.execute(sql`DELETE FROM purchase_request_persetujuan`);
//             await trx.execute(sql`DELETE FROM purchase_request_detail`);
//             await trx.execute(sql`DELETE FROM purchase_request`);

//             await trx.execute(sql`DELETE FROM payment_ar_detail`);
//             await trx.execute(sql`DELETE FROM acc_ar_faktur`);
//             await trx.execute(sql`DELETE FROM payment_ar`);

//             await trx.execute(sql`DELETE FROM invoice_delivery_order`);
//             await trx.execute(sql`DELETE FROM invoice_detail`);
//             await trx.execute(sql`DELETE FROM invoice_hpp`);
//             await trx.execute(sql`DELETE FROM invoice`);

//             await trx.execute(sql`DELETE FROM delivery_order_hpp`);
//             await trx.execute(sql`DELETE FROM delivery_order_detail`);
//             await trx.execute(sql`DELETE FROM delivery_order`);

//             await trx.execute(sql`DELETE FROM internal_transfer_hpp`);
//             await trx.execute(sql`DELETE FROM internal_transfer_detail`);
//             await trx.execute(sql`DELETE FROM internal_transfer`);

//             await trx.execute(sql`DELETE FROM internal_order_detail`);
//             await trx.execute(sql`DELETE FROM internal_order`);

//             await trx.execute(sql`DELETE FROM sales_order_detail`);
//             await trx.execute(sql`DELETE FROM sales_order`);

//             await trx.execute(sql`DELETE FROM quotation_detail`);
//             await trx.execute(sql`DELETE FROM quotation`);
//         });
//         res.status(200).json({
//             message: "Success Reset DB",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // await trx.execute(sql`DELETE FROM gudang`);
// // await trx.execute(sql`DELETE FROM barang_minmax`);
// // await trx.execute(sql`DELETE FROM barang_satuan`);
// // await trx.execute(sql`DELETE FROM barang_images`);
// // await trx.execute(sql`DELETE FROM barang`);
// // await trx.execute(sql`DELETE FROM kategori_kontak`);
// // await trx.execute(sql`DELETE FROM kategori_barang`);
// // await trx.execute(sql`DELETE FROM pajak`);
// // await trx.execute(sql`DELETE FROM menu`);
// // await trx.execute(sql`DELETE FROM brand`);
// // await trx.execute(sql`DELETE FROM account`);
// // await trx.execute(sql`DELETE FROM setting`);
// // await trx.execute(sql`DELETE FROM kontak`);
// // await trx.execute(sql`DELETE FROM satuan`);
// // await trx.execute(sql`DELETE FROM pengguna`);
// // await trx.execute(sql`DELETE FROM permission`);
// // await trx.execute(sql`DELETE FROM role_permission`);
// // await trx.execute(sql`DELETE FROM role`);
// // await trx.execute(sql`DELETE FROM jenis_kendaraan`);
