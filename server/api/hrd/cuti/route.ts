// import { Router } from "express";
// import { auth } from "../../../middleware/authMiddleware";
// import { upload } from "../../../middleware/uploadMiddleware";
// import {
//     createCuti,
//     createCutiSub,
//     createMasterCuti,
//     destroyKebijakan,
//     destroySubCuti,
//     getCutiApproval,
//     getCutiById,
//     getCutiKebijakan,
//     getCutiMaster,
//     getCutiSub,
//     getJabatan,
//     getKebijakanById,
//     index,
//     updateCutiStatus,
//     updateMasterCuti,
//     updateSubCutiById,
// } from "./controller";

// const router = Router();

// router.get("/", auth, index);
// router.get("/jabatan", auth, getJabatan);
// router.get("/detail/:id", auth, getCutiById);
// router.get("/approve", auth, getCutiApproval);
// router.get("/type", auth, getCutiMaster);
// router.post("/", auth, upload.single("foto"), createCuti);
// router.post("/create-master", auth, createMasterCuti);
// router.patch("/:id", auth, updateCutiStatus);

// // sub-cuti
// router.get("/sub-cuti/:id", auth, getCutiSub);
// router.post("/sub-cuti", auth, createCutiSub);
// router.delete("/sub-cuti/:id", auth, destroySubCuti);
// router.patch("/sub-cuti/:id", auth, updateSubCutiById);

// // master-kebijakan
// router.get("/kebijakan", auth, getCutiKebijakan);
// router.delete("/kebijakan/:id", auth, destroyKebijakan);
// router.get("/kebijakan/:id", auth, getKebijakanById);
// router.patch("/kebijakan/:id", auth, updateMasterCuti);

// export { router as cutiRoute };
