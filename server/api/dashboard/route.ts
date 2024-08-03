import { Router } from "express";
import { auth } from "../../middleware/authMiddleware";
import { indexAPBelumLunas, indexARBelumLunas, indexPendapatan, indexTarget, produkTerlaris, totalBeban, totalCustomer, totalHutang, totalPiutang, totalProduk, totalUang } from "./controller";

const router = Router();

router.get("/ap", auth, indexAPBelumLunas);
router.get("/ar", auth, indexARBelumLunas);
router.get("/pendapatan", auth, indexPendapatan);
router.get("/target", auth, indexTarget);


router.get("/total-hutang", auth, totalHutang);
router.get("/total-piutang", auth, totalPiutang);
router.get("/produk-terlaris", auth, produkTerlaris);
router.get("/total-beban", auth, totalBeban);


router.get("/total-customer", auth, totalCustomer);
router.get("/total-produk", auth, totalProduk);
router.get("/total-uang", auth, totalUang);

export { router as dashboardRoute };
