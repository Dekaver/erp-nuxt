import { Router } from "express";
import { index, store, update, destroy } from "./controller";
import { auth } from "../../middleware/authMiddleware";
const router = Router().use(auth);

router.get("/", index);
router.post("/", store);
router.patch("/", update);
router.delete("/", destroy);

export { router as settingPembelianRoute };
