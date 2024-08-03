import { Router } from "express";
import { index, show, update } from "./controller";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.patch("/:id", update);

export { router as PenggunaPermissionRoute };
