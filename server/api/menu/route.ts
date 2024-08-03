import { Router } from "express";
import { index, show, store, update, destroy, getMenuByName } from "../menu/controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", auth, index);
router.get("/:name/parent", auth, getMenuByName);
router.get("/:id", auth, show);
router.post("/", auth, store);
router.patch("/:id", auth, update);
router.delete("/:id", auth, destroy);

export { router as menuRoute };
