// import { Router } from "express";
// import { auth } from "../../../middleware/authMiddleware";
// import { upload } from "../../../middleware/uploadMiddleware";
// import {
//     absenToday,
//     checkAbsenCoordinate,
//     destroy,
//     getAktivitas,
//     index,
//     postClockIn,
//     postClockOut,
//     recapCalendar,
//     recapEmployeesPerDays,
//     recapEmployeesPerMonth,
//     recapEmployeesPerMonthWebsite,
//     recapStatistics,
//     store,
//     update,
// } from "./controller";

// const router = Router();

// router.get("/", auth, index);
// router.get("/today", auth, absenToday);
// router.get("/check-coordinate", auth, checkAbsenCoordinate);
// router.get("/month-recap", auth, recapEmployeesPerMonth);
// router.get("/month-recap-website", auth, recapEmployeesPerMonthWebsite);
// router.get("/days-recap", auth, recapEmployeesPerDays);
// router.get("/statistics/:id", auth, recapStatistics);
// router.get("/aktivitas-absen", auth, getAktivitas);
// router.get("/calendar/:id", auth, recapCalendar);
// router.post("/create", auth, store);
// router.post("/masuk", auth, upload.single("foto"), postClockIn);
// router.post("/keluar", auth, upload.single("foto"), postClockOut);
// router.patch("/edit", auth, update);
// router.patch("/delete", auth, destroy);

// export { router as absenRoute };

