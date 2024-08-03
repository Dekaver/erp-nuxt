import { Router } from "express";

import { auth } from "../../middleware/authMiddleware";
import {
    destroy,
    index,
    indexByJatuhTempoFaktur,
    indexBySupplierDetail,
    indexFaktur,
    journalCetak,
    show,
    showLaporanAp,
    store,
    storeWithPenerimaanBarang,
    storeWithPurchaseOrder,
    umurInvoiceAp,
    update,
} from "./controller";
import { apSettingRoute } from "./setting/route";
import { apPersetujuanRoute } from "./persetujuan/route";

const router = Router().use(auth);

router.use("/setting", apSettingRoute);
router.use("/persetujuan", apPersetujuanRoute);

router.get("/laporan", showLaporanAp);
router.get("/umur-invoice", umurInvoiceAp);
router.get("/faktur", indexFaktur);
router.get("/detail/supplier/:supplier", indexBySupplierDetail);
router.get("/supplier/:supplier/faktur", indexFaktur);
router.get("/tanggal/:tanggal/faktur", indexByJatuhTempoFaktur);
router.get("/", index);
router.get("/:id/journal", journalCetak);
router.get("/:id", show);

router.post("/", store);
router.post("/penerimaan-barang", storeWithPenerimaanBarang);
router.post("/purchase-order", storeWithPurchaseOrder);
router.patch("/:id", update);
router.delete("/:id", destroy);

export { router as apRoute };
