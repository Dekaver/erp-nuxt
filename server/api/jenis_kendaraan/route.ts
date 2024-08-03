import { Router } from "express";
import { index, show, store, update, destroy } from "./controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", auth, index);
router.get("/:id", auth, show);
router.post("/", auth, store);
router.patch("/:id", auth, update);
router.delete("/:id", auth, destroy);

export { router as jenisKendaraanRoute };
