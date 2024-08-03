// import { Router } from "express";
// import { auth } from "../../../middleware/authMiddleware";
// import { createMasterLembur, destroy, destroyKebijakan, getKaryawanLembur, getKebijakanById, getKebijakanLembur, index, show, store, update, updateMasterLembur } from "./controller";

// const router = Router();

// router.get("/", auth, index);
// router.get("/:id_lembur_karyawan", auth, show);
// router.post("/", auth, store);
// router.patch("/:id_lembur_karyawan", auth, update);
// router.delete("/:id_lembur_karyawan", auth, destroy);

// // lembur-karyawan
// router.get("/karyawan/all", auth, getKaryawanLembur);
// router.post("/kebijakan/", auth, createMasterLembur);
// router.delete("/kebijakan/:id", auth, destroyKebijakan);
// router.get("/kebijakan/all", auth, getKebijakanLembur);
// router.get("/kebijakan/detail/:id", auth, getKebijakanById);
// router.patch("/kebijakan/update/:id", auth, updateMasterLembur);

// export { router as lemburRoute };

