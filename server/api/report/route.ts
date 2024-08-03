import { Router } from "express";
import { auth } from "../../middleware/authMiddleware";
import { getReportHutangSupplier, getReportPembelian, getReportPembelianProduk, getReportPembelianSupplier, getReportPenerimaanBarang } from "./pembelian/controller";
import { getReportPenjualan, getReportPenjualanProduk, getReportPenjualanCustomer } from "./penjualan/controller";

const router = Router();

router.get("/pembelian", auth, getReportPembelian);
router.get("/pembelian-produk", auth, getReportPembelianProduk);
router.get("/pembelian-supplier", auth, getReportPembelianSupplier);

router.get("/penerimaan-barang", auth, getReportPenerimaanBarang);
router.get("/hutang-supplier", auth, getReportHutangSupplier);


router.get("/penjualan", auth, getReportPenjualan);
router.get("/penjualan-produk", auth, getReportPenjualanProduk);
router.get("/penjualan-customer", auth, getReportPenjualanCustomer);

export { router as reportRoute };
