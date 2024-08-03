import { Router } from "express";
import { index, show, store, update, destroy, parent } from "./controller";

const router = Router();

router.get("/getParent", parent);
router.get("/", index);
router.get("/:id", show);
router.post("/", store);
router.patch("/:id", update);
router.delete("/:id", destroy);

export { router as permissionRoute };
