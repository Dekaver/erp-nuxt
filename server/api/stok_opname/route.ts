import { Router } from "express";
import { index, show, store, update, destroy, importExcel } from "./controller";
import multer from "multer";
import { auth } from "../../middleware/authMiddleware";

const router = Router().use(auth);

router.get("/", index);
router.get("/:id", show);
router.post("/:id/upload", multer({ dest: "uploads/" }).single("file"), importExcel);
router.post("/", store);
router.patch("/:id", update);
router.delete("/:id", destroy);

export { router as stokOpnameRoute };
