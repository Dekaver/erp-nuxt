import { Router } from "express";

import { auth } from "../../../middleware/authMiddleware";
import { index, store, update } from "./controller";

const router = Router().use(auth);

router.get("/", index);
router.post("/", store);
router.patch("/:id", update);

export { router as purchaseRequestSettingRoute };
