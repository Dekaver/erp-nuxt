import { Router } from "express";
import {
    indexProvinsi,
    indexKota,
    indexKecamatan,
    indexKelurahan,
    indexKodePos,
    indexKotaByProvinsi,
    indexKecamatanByKota,
    indexKelurahanByKecamatan,
    indexKodePosByKecamatan,
    showCompleteAddress,
} from "./controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.get("/provinsi", auth, indexProvinsi);
router.get("/kota", auth, indexKota);
router.get("/kecamatan", auth, indexKecamatan);
router.get("/kelurahan", auth, indexKelurahan);
router.get("/kode-pos", auth, indexKodePos);

router.get("/provinsi/:id_provinsi/kabupaten/:id_kabupaten/kecamatan/:id_kecamatan", auth, showCompleteAddress);
router.get("/kota/:id", auth, indexKotaByProvinsi);
router.get("/kecamatan/:id", auth, indexKecamatanByKota);
router.get("/kelurahan/:id", auth, indexKelurahanByKecamatan);
router.get("/kode-pos/:id", auth, indexKodePosByKecamatan);

export { router as indoRoute };
