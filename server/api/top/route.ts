import { Router } from "express";
import { index, show, store, update, destroy } from "./controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router().use(auth);

router.get("/", index);
router.get("/:id", show);
router.post("/", store);
router.patch("/:id", update);
router.delete("/:id", destroy);

export { router as topRoute };
