import { Router } from "express";
import { index, getOption, show, store, update, destroy, getOptionAvailablePegawai, updateFoto, getFoto } from "../pegawai/controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", auth, index);
router.get("/option", auth, getOption);
router.get("/available", auth, getOptionAvailablePegawai);
router.get("/:id_pegawai/foto", auth, getFoto);
router.get("/:id_pegawai", auth, show);
router.post("/", auth, store);
router.patch("/:id_pegawai/foto", auth, updateFoto);
router.patch("/:id_pegawai", auth, update);
router.delete("/:id_pegawai", auth, destroy);

export { router as pegawaiRoute };
