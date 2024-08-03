import { Router } from "express";
import { index, show, store, update, destroy } from "../target/controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", auth, index);
router.get("/:tahun/:kantor", auth, show);
router.post("/", auth, store);
router.patch("/", auth, update);
router.delete("/:tahun/:kantor", auth, destroy);

export { router as targetRoute };
