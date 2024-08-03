import { Router } from "express";
import { auth } from "../../middleware/authMiddleware";
import { show, store, update, destroy, index } from "./controller";

const router = Router();

router.get("/", auth, index);
router.get("/:id", auth, show);
router.post("/", auth, store);
router.patch("/:id", auth, update);
router.delete("/:id", auth, destroy);

export { router as internalPerusahaanRoute };
