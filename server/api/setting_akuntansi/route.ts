import { Router } from "express";
import { auth } from "../../middleware/authMiddleware";
import { destroy, index, store, update } from "./controller";

const router = Router();

router.get("/", index);
router.post("/", auth, store);
router.patch("/", auth, update);
router.delete("/:id", auth, destroy);

export { router as settingAkuntansiRoute };

