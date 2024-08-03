import { Router } from "express";
import { index, show, store, update, destroy, journalCetak, indexYearlyInvoice, cetak, storeWithSO, storeWithPengirimanBarang } from "./controller";
import { auth } from "../../middleware/authMiddleware";
import { invoiceSettingRoute } from "./setting/route";
import { invoicePersetujuanRoute } from "./persetujuan/route";

const router = Router().use(auth);

router.use("/setting", invoiceSettingRoute);
router.use("/persetujuan", invoicePersetujuanRoute);

router.get("/yearly", indexYearlyInvoice);
router.get("/", index);
router.get("/:id/cetak", cetak);
router.get("/:id/journal", journalCetak);
router.get("/:id", show);
router.patch("/:id", update);
router.delete("/:id", destroy);

router.post("/", store);
router.post("/so/create", storeWithSO);
router.post("/pengiriman-barang", storeWithPengirimanBarang);

export { router as invoiceRoute };
