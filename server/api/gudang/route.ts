import { Router } from "express";
import { index, show, store, update, destroy, showHistoryStok } from "../gudang/controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.get(`/history-stok-barang/:id_barang/:id_gudang/:bulan/:tahun`, auth, showHistoryStok);
router.get("/", auth, index);
router.get("/:id", auth, show);
router.post("/", auth, store);
router.patch("/:id", auth, update);
router.delete("/:id", auth, destroy);

export { router as gudangRoute };
