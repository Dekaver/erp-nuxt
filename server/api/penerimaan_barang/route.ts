import { Router } from "express";
import { index, show, store, update, destroy, option } from "./controller";
import { auth } from "../../middleware/authMiddleware";
import { penerimaanBarangSettingRoute } from "./setting/route";
import { penerimaanBarangPersetujuanRoute } from "./persetujuan/route";

const router = Router().use(auth);

router.use("/setting", penerimaanBarangSettingRoute);
router.use("/persetujuan", penerimaanBarangPersetujuanRoute);

router.get("/detail", index);
router.get("/option", option);
router.get("/", index);
router.get("/:id/detail", show);
router.get("/:id", show);
router.post("/detail", store);
router.post("/", store);
router.patch("/:id/detail", update);
router.patch("/:id", update);
router.delete("/:id/detail", destroy);
router.delete("/:id", destroy);

export { router as penerimaanBarangRoute };
