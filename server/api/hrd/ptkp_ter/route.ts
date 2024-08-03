import { Router } from "express";
import { index, show, save, destroy, terForMapping } from "./controller";
import { auth } from "../../../middleware/authMiddleware";

const router = Router();

router.get("/:id_ptkp/index", auth, index);
router.get("/:id_ptkp/mapping", auth, terForMapping);
router.get("/:id/show", auth, show);
router.post("/", auth, save);
router.delete("/:id", auth, destroy);

export { router as ptkpTerRoute };
