import { Router } from "express";
import { auth } from "../../middleware/authMiddleware";
import { index, show, store, update, destroy, indexDetail, showDetail, storeDetail, updateDetail, destroyDetail } from "./controller";

const router = Router();

router.get("/detail", auth, indexDetail);
router.get("/", auth, index);
router.get("/:id/detail", auth, showDetail);
router.get("/:id", auth, show);
router.post("/detail", auth, storeDetail);
router.post("/", auth, store);
router.patch("/:id/detail", auth, updateDetail);
router.patch("/:id", auth, update);
router.delete("/:id/detail", auth, destroyDetail);
router.delete("/:id", auth, destroy);

export { router as accProposalApRoute };
