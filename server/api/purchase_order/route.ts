import { Router } from "express";
import { index, show, store, update, destroy, option, outstandingPO, cetak, storeWithPurchaseRequest } from "./controller";
import { auth } from "../../middleware/authMiddleware";
import { poSettingRoute } from "./setting/route";
import { purchaseOrderPersetujuanRoute } from "./persetujuan/route";

const router = Router().use(auth);

router.use("/setting", poSettingRoute);
router.use("/persetujuan", purchaseOrderPersetujuanRoute);

router.get(`/outstanding`, outstandingPO);
router.get("/option", option);
router.get("/:id/cetak", cetak);
router.get("/:id", show);
router.get("/", index);
router.post("/", store);
router.patch("/:id", update);
router.delete("/:id", destroy);

router.post("/purchase-request", storeWithPurchaseRequest);

export { router as purchaseOrderRoute };
