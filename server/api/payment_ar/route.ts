import { Router } from "express";
import { index, show, store, update, destroy, journalCetak } from "./controller";
import { auth } from "../../middleware/authMiddleware";
import { paymentArSettingRoute } from "./setting/route";

const router = Router();

router.use("/setting", paymentArSettingRoute)

router.get("/", auth, index);
router.get("/:id/journal", auth, journalCetak);
router.get("/:id", auth, show);
router.post("/", auth, store);
router.patch("/:id", auth, update);
router.delete("/:id", auth, destroy);

export { router as paymentArRoute };
