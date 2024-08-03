// import { and, desc, eq, sql } from "drizzle-orm";

// import { NewAbsenTempat, absenTempat } from "../absen_tempat/schema";
// import { jadwalKerja, jadwalKerjaKaryawan, jadwalKerjaWaktu } from "../jadwal_kerja/schema";
// import { absen } from "./schema";

// // get user recap with month and year filter
// export const get = async (userId: number, month: number, year: number, tx = db) => {
//     const data = await tx.execute(
//         sql.raw(`SELECT 
//         a.*, 
//         b.batas_terlambat, 
//         b.batas_pulang, 
//         c.nama
//       FROM
//         hr.absen a 
//       LEFT JOIN 
//         hr.jadwal_kerja b
//       ON
//         a.id_jadwal_kerja = b.id
//       INNER JOIN
//         hr.pegawai c
//       ON
//         a.id_absen = c.id
//       WHERE 
//         id_absen=${userId}
//       AND
//         EXTRACT(MONTH FROM tanggal) = ${month} 
//       AND 
//         EXTRACT(YEAR FROM tanggal) = ${year}
//       ORDER BY
//         tanggal DESC`),
//     );

//     return data;
// };

// export const createAbsen = async (userId: number, tanggal: string, ket: string, catatan: string, tx = db) => {
//     const data = await tx.execute(
//         sql.raw(`INSERT INTO 
//         hr.absen (tanggal, id_absen, keterangan, catatan )
//       VALUES 
//         ('${tanggal}', ${userId}, '${ket}', '${catatan}')
//       RETURNING *;
//       `),
//     );

//     return data;
// };

// export const updateKeterangan = async (userId: number, tanggal: string, ket: string, catatan: string, tx = db) => {
//     const data = await tx.execute(
//         sql.raw(`
//         UPDATE 
//           hr.absen
//         SET 
//           keterangan='${ket}', catatan='${catatan}'
//         WHERE 
//           tanggal='${tanggal}' 
//         AND 
//           id_absen=${userId}
//         RETURNING *;
//     `),
//     );

//     return data;
// };

// export const deleteAbsen = async (userId: number, tanggal: string, tx = db) => {
//   const data = await tx.execute(
//       sql.raw(`
//       DELETE FROM 
//        hr.absen
//       WHERE 
//         tanggal='${tanggal}' 
//       AND 
//         id_absen=${userId}
//       RETURNING *;
//   `),
//   );

//   return data;
// };

// export const getAbsenToday = async (userId: number, tx = db) => {
//     const currentDate = new Date();
//     const options = { timeZone: "Asia/Makassar", hour12: false };
//     const formattedDate = currentDate.toLocaleDateString("en-US", options);

//     const [data] = await tx.execute(
//         sql.raw(`SELECT 
//       a.*, b.batas_terlambat, b.batas_pulang 
//     FROM
//       hr.absen a 
//     LEFT JOIN 
//       hr.jadwal_kerja b
//     ON 
//       a.id_jadwal_kerja = b.id
//     WHERE 
//       a.tanggal = '${formattedDate}'
//     AND 
//       a.id_absen=${userId} 
//     LIMIT 1`),
//     );

//     return data;
// };

// export const getAktivitasAbsen = async (userId: number, month: number, year: number, tx = db) => {
//     const [getJadwalKerja] = await tx.select().from(jadwalKerjaKaryawan).where(eq(jadwalKerjaKaryawan.id_pegawai, userId));

//     const data = await tx.execute(
//         sql.raw(`SELECT
//                 ap.tanggal,
//                 jk.day,
//                 jk.nama_waktu,
//                 jk.selected,
//                 jk.time_break,
//                 jk.time_in,
//                 jk.time_out,
//                 hl.tanggal IS NOT NULL AS is_libur,
//                 hl.nama AS nama_hari_libur,
//                 a.tanggal IS NOT NULL as is_absen,
//                 a.keterangan,
//                 a.catatan
//             FROM
//                 (SELECT generate_series(start, end_date, interval '1 day')::date AS tanggal
//                 FROM hr.absen_periode
//                 WHERE year='${year}' AND month=${month}) AS ap
//             CROSS JOIN hr.jadwal_kerja_waktu jk
//             LEFT JOIN hari_libur hl ON hl.tanggal = ap.tanggal
//             LEFT JOIN hr.absen a ON a.tanggal = ap.tanggal AND a.id_absen = ${userId}
//             WHERE EXTRACT(DOW FROM ap.tanggal) = jk.day AND jk.id_jadwal_kerja = ${getJadwalKerja.id_jadwal_kerja}
//             ORDER BY tanggal;
//   `),
//     );

//     return data;
// };

// export const getRecapPerDaysKaryawan = async (status: number | undefined, date: string, tx = db) => {
//     let query =
//         status == 1 || status == undefined
//             ? `SELECT 
//                 a.*, 
//                 b.batas_terlambat, 
//                 b.batas_pulang, 
//                 c.nama, 
//                 c.fotonya, 
//                 d.name AS jabatan,
//                 status = true AS is_already_clock_in
//               FROM
//                 hr.absen a 
//               LEFT JOIN 
//                 hr.jadwal_kerja b
//               ON
//                 a.id_jadwal_kerja = b.id
//               INNER JOIN
//                 hr.pegawai c
//               ON 
//                 a.id_absen = c.id
//               LEFT JOIN
//                 hr.jabatan d
//               ON
//                 c.id_jabatan = d.id
//               WHERE 
//                 a.tanggal='${date}'
//               ORDER BY 
//                 c.nama`
//             : `SELECT 
//                 DISTINCT p.nama, 
//                 p.fotonya,
//                 j.name AS jabatan,
//                 status = false as is_already_clock_in
//               FROM
//                 hr.pegawai p 
//               LEFT JOIN 
//                 hr.absen a
//               ON
//                 a.id_absen = p.id
//               LEFT JOIN
//                 hr.jabatan j
//               ON
//                 p.id_jabatan = j.id
//               WHERE NOT EXISTS (
//                 SELECT 
//                   1
//                 FROM 
//                   hr.absen a
//                 WHERE 
//                   p.id = a.id_absen
//                 AND 
//                   a.tanggal='${date}'
//               )
//               ORDER BY 
//                 p.nama`;

//     const data = await tx.execute(sql.raw(query));

//     return data;
// };

// // GET employees absensi recap per month
// export const getRecapPerMonthKaryawan = async (userId: number | undefined, month: number, year: number, tx = db) => {
//     let query = `SELECT
//     a.id,
//     a.nama,
//     a.fotonya,
//     b.name,
//     COALESCE(present, 0) as present,
//     COALESCE(late, 0) as late,
//     COALESCE(sick, 0) as sick,
//     COALESCE(leave, 0) as leave,
//     COALESCE(cuti, 0) as cuti,
//     COALESCE(total_attendance, 0) as total_attendance
//   FROM
//     hr.pegawai a
//   LEFT JOIN
//     hr.jabatan b ON a.id_jabatan = b.id
//   LEFT JOIN (
//     SELECT
//       id_absen,
//       COUNT(DISTINCT CASE WHEN jam_masuk IS NOT NULL THEN tanggal END) as total_attendance,
//       COUNT(DISTINCT CASE WHEN jam_masuk IS NOT NULL THEN tanggal END) as present,
//       COUNT(DISTINCT CASE WHEN keterangan LIKE '%Masuk Terlambat%' THEN tanggal END) as late,
//       COUNT(DISTINCT CASE WHEN keterangan LIKE '%Sakit%' THEN tanggal END) as sick,
//       COUNT(DISTINCT CASE WHEN keterangan LIKE '%Izin%' THEN tanggal END) as leave,
//       COUNT(DISTINCT CASE WHEN keterangan LIKE '%Cuti%' THEN tanggal END) as cuti
//     FROM
//       hr.absen
//     WHERE
//       EXTRACT(MONTH FROM tanggal) = ${month} 
//       AND EXTRACT(YEAR FROM tanggal) = ${year} 
//       GROUP BY id_absen) c 
//     ON 
//       a.id = c.id_absen`;

//     if (userId != undefined) {
//         query += ` WHERE a.id=${userId};`;
//     }

//     query += ` ORDER BY a.nama ASC`;

//     const data = await tx.execute(sql.raw(query));
//     const listAllData = data.map(function (data) {
//         return {
//             id: data.id,
//             nama: data.nama,
//             fotonya: data.fotonya,
//             jabatan: data.jabatan,
//             present: parseInt(data.present as string),
//             late: parseInt(data.late as string),
//             sick: parseInt(data.sick as string),
//             leave: parseInt(data.leave as string),
//             cuti: parseInt(data.cuti as string),
//             total_attendance: parseInt(data.total_attendance as string),
//         };
//     });
//     return listAllData;
// };

// // GET employees absensi recap per month for website-product
// export const getRecapPerMonthKaryawanWebsite = async (month: number, year: number, tx = db) => {
//     let query = `
//     SELECT 
//       nama,
//       COALESCE(MAX(CASE WHEN day = 1 AND status IS NOT NULL THEN status END), NULL) AS "1",
//       COALESCE(MAX(CASE WHEN day = 2 AND status IS NOT NULL THEN status END), NULL) AS "2",
//       COALESCE(MAX(CASE WHEN day = 3 AND status IS NOT NULL THEN status END), NULL) AS "3",
//       COALESCE(MAX(CASE WHEN day = 4 AND status IS NOT NULL THEN status END), NULL) AS "4",
//       COALESCE(MAX(CASE WHEN day = 5 AND status IS NOT NULL THEN status END), NULL) AS "5",
//       COALESCE(MAX(CASE WHEN day = 6 AND status IS NOT NULL THEN status END), NULL) AS "6",
//       COALESCE(MAX(CASE WHEN day = 7 AND status IS NOT NULL THEN status END), NULL) AS "7",
//       COALESCE(MAX(CASE WHEN day = 8 AND status IS NOT NULL THEN status END), NULL) AS "8",
//       COALESCE(MAX(CASE WHEN day = 9 AND status IS NOT NULL THEN status END), NULL) AS "9",
//       COALESCE(MAX(CASE WHEN day = 10 AND status IS NOT NULL THEN status END), NULL) AS "10",
//       COALESCE(MAX(CASE WHEN day = 11 AND status IS NOT NULL THEN status END), NULL) AS "11",
//       COALESCE(MAX(CASE WHEN day = 12 AND status IS NOT NULL THEN status END), NULL) AS "12",
//       COALESCE(MAX(CASE WHEN day = 13 AND status IS NOT NULL THEN status END), NULL) AS "13",
//       COALESCE(MAX(CASE WHEN day = 14 AND status IS NOT NULL THEN status END), NULL) AS "14",
//       COALESCE(MAX(CASE WHEN day = 15 AND status IS NOT NULL THEN status END), NULL) AS "15",
//       COALESCE(MAX(CASE WHEN day = 16 AND status IS NOT NULL THEN status END), NULL) AS "16",
//       COALESCE(MAX(CASE WHEN day = 17 AND status IS NOT NULL THEN status END), NULL) AS "17",
//       COALESCE(MAX(CASE WHEN day = 18 AND status IS NOT NULL THEN status END), NULL) AS "18",
//       COALESCE(MAX(CASE WHEN day = 19 AND status IS NOT NULL THEN status END), NULL) AS "19",
//       COALESCE(MAX(CASE WHEN day = 20 AND status IS NOT NULL THEN status END), NULL) AS "20",
//       COALESCE(MAX(CASE WHEN day = 21 AND status IS NOT NULL THEN status END), NULL) AS "21",
//       COALESCE(MAX(CASE WHEN day = 22 AND status IS NOT NULL THEN status END), NULL) AS "22",
//       COALESCE(MAX(CASE WHEN day = 23 AND status IS NOT NULL THEN status END), NULL) AS "23",
//       COALESCE(MAX(CASE WHEN day = 24 AND status IS NOT NULL THEN status END), NULL) AS "24",
//       COALESCE(MAX(CASE WHEN day = 25 AND status IS NOT NULL THEN status END), NULL) AS "25",
//       COALESCE(MAX(CASE WHEN day = 26 AND status IS NOT NULL THEN status END), NULL) AS "26",
//       COALESCE(MAX(CASE WHEN day = 27 AND status IS NOT NULL THEN status END), NULL) AS "27",
//       COALESCE(MAX(CASE WHEN day = 28 AND status IS NOT NULL THEN status END), NULL) AS "28",
//       COALESCE(MAX(CASE WHEN day = 29 AND status IS NOT NULL THEN status END), NULL) AS "29",
//       COALESCE(MAX(CASE WHEN day = 30 AND status IS NOT NULL THEN status END), NULL) AS "30",
//       COALESCE(MAX(CASE WHEN day = 31 AND status IS NOT NULL THEN status END), NULL) AS "31"
//     FROM (
//         SELECT 
//             b.nama, 
//             EXTRACT(day FROM a.tanggal)::int AS day, 
//             MAX(CASE 
//               WHEN keterangan LIKE '%Masuk Tepat Waktu%' THEN 'present' 
//               WHEN keterangan LIKE '%Masuk Terlambat%' THEN 'late'
//               WHEN keterangan LIKE '%Izin%' THEN 'izin'
//               WHEN keterangan LIKE '%Sakit%' THEN 'sick'
//               WHEN keterangan LIKE '%Cuti%' THEN 'cuti' END) 
//             AS status
//         FROM 
//             hr.pegawai b
//         LEFT JOIN
//             hr.absen a
//         ON 
//             b.id = a.id_absen 
//             AND EXTRACT(month FROM a.tanggal) = ${month} 
//             AND EXTRACT(year FROM a.tanggal) = ${year}
//         GROUP BY b.nama, day
//     ) AS crosstab_data
//     GROUP BY nama
//     ORDER BY nama;
//   `;

//     const data = await tx.execute(sql.raw(query));

//     return data;
// };

// // GET employees statistics recap
// export const getStatisticsEmployee = async (userId: number | undefined, month: number, year: number, tx = db) => {
//     let query = `SELECT
//                 COUNT(DISTINCT CASE WHEN jam_masuk IS NOT NULL THEN tanggal END) as present,
//                 COUNT(DISTINCT CASE WHEN keterangan LIKE '%Masuk Terlambat%' THEN tanggal END) as late,
//                 COUNT(DISTINCT CASE WHEN keterangan LIKE '%Sakit%' THEN tanggal END) as sick,
//                 COUNT(DISTINCT CASE WHEN keterangan LIKE '%Izin%' THEN tanggal END) as leave,
//                 COUNT(DISTINCT CASE WHEN keterangan LIKE '%Cuti%' THEN tanggal END) as cuti,
//                 COUNT(DISTINCT CASE WHEN jam_masuk IS NOT NULL THEN tanggal END) as total_attendance
//               FROM
//                 hr.absen
//               WHERE
//                 id_absen = ${userId}
//                 AND EXTRACT(MONTH FROM tanggal) = ${month}
//                 AND EXTRACT(YEAR FROM tanggal) = ${year};`;

//     const data = await tx.execute(sql.raw(query));
//     const listAllData = data.map(function (data) {
//         return {
//             present: parseInt(data.present as string),
//             late: parseInt(data.late as string),
//             sick: parseInt(data.sick as string),
//             leave: parseInt(data.leave as string),
//             cuti: parseInt(data.cuti as string),
//             total_attendance: parseInt(data.total_attendance as string),
//         };
//     });
//     return listAllData[0];
// };

// export const getRecapPerMonthCalendar = async (userId: number, tx = db) => {
//     const resAllData = await tx.select().from(absen).where(eq(absen.id_absen, userId)).orderBy(desc(absen.tanggal));

//     // reduce is used to remove {} after mapping
//     const listResult = resAllData.reduce(function (result, data) {
//         const key = data["tanggal"];
//         (data as any).event_status = (data as any)["keterangan"].split(",").map((str: string) => str.trim());
//         (result as any)[key] = [data];
//         return result;
//     }, {});
//     return listResult;
// };

// export const checkCoordinate = async (latitude: number, longitude: number, tx = db) => {
//     // CHECK THE NEAREST PLACE
//     const getAbsenTempat = await tx.select().from(absenTempat);

//     // GET ALL THE DISTANCE FROM ALL THE DATA FROM absen_tempat TABLE
//     const listAbsenTempat = getAbsenTempat.map((data: NewAbsenTempat) => {
//         return calculateDistance(latitude, longitude, data.latitude, data.longitude);
//     });

//     // FIND THE MINIMUM DISTANCE FROM THE LIST
//     const minimum = Math.min(...listAbsenTempat);

//     // GET DATA absen_tempat FROM THE MINIMUM DISTANCE
//     const theNearestPlace = getAbsenTempat[listAbsenTempat.indexOf(minimum)];

//     // CHECK IF DISTANCE (meter) IS GREATER THAN jarak_absen THEN
//     // ABSEN SHOULD NOT BE PROHIBITED.
//     if (minimum > theNearestPlace.jarak_absen) {
//         console.log(`distance: ${minimum}`);
//         return undefined;
//         // ELSE: IF THE latitude, longitude closer
//         // to one of the places, it should return the data id
//     } else {
//         return theNearestPlace.id;
//     }
// };

// export const clockIn = async (userId: number, idAbsenTempat: number, latitude: number, longitude: number, foto: any, tx = db) => {
//     const currentDate = new Date();
//     const options = { timeZone: "Asia/Makassar", hour12: false };
//     const formattedDate = currentDate.toLocaleDateString("en-US", options);
//     const formattedTime = currentDate.toLocaleTimeString("en-US", options);
//     const today = new Date(formattedDate).getDay();

//     let dayNumber;
//     switch (today) {
//         case 0:
//             dayNumber = 7; // Minggu
//             break;
//         case 1:
//             dayNumber = 1; // Senin
//             break;
//         case 2:
//             dayNumber = 2; // Selasa
//             break;
//         case 3:
//             dayNumber = 3; // Rabu
//             break;
//         case 4:
//             dayNumber = 4; // Kamis
//             break;
//         case 5:
//             dayNumber = 5; // Jumat
//             break;
//         case 6:
//             dayNumber = 6; // Sabtu
//             break;
//         default:
//             dayNumber = 0;
//     }

//     const [getJadwalKaryawan] = await tx.select().from(jadwalKerjaKaryawan).where(eq(jadwalKerjaKaryawan.id_pegawai, userId));

//     const [getJadwalKerja] = await tx.select().from(jadwalKerja).where(eq(jadwalKerja.id, getJadwalKaryawan.id_jadwal_kerja));

//     const [getJadwalKaryawanWaktu] = await tx
//         .select()
//         .from(jadwalKerjaWaktu)
//         .where(and(eq(jadwalKerjaWaktu.id_jadwal_kerja, getJadwalKerja.id), eq(jadwalKerjaWaktu.day, dayNumber)));

//     if (dayNumber !== 7 && dayNumber !== 6) {
//         const date1 = `2023-01-01T${getJadwalKaryawanWaktu.time_in}`;
//         const date2 = `2023-01-01T${formattedTime}`;

//         // calculate how much difference in minute between time_in and clock_in_time
//         const timeDifferenceInMinutes = differenceInMinutes(date2, date1);

//         var absenceDescription = "";

//         if (typeof timeDifferenceInMinutes === "number") {
//             absenceDescription = timeDifferenceInMinutes > getJadwalKerja.batas_terlambat ? "Masuk Terlambat " : "Masuk Tepat Waktu";
//         } else {
//             return undefined;
//         }

//         await tx.execute(
//             sql.raw(`
//               INSERT INTO hr.absen(
//                 tanggal,
//                 jam_masuk,
//                 keterangan,
//                 tipe_absen,
//                 id_jadwal_kerja,
//                 id_absen,
//                 overtimebefore,
//                 overtimeafter,
//                 id_status_absen,
//                 time_break,
//                 time_in,
//                 time_out,
//                 schedule,
//                 foto_masuk,
//                 id_absen_tempat,
//                 coordinate_clock_in)
//               VALUES (
//                 '${formattedDate}',
//                 '${formattedTime}',
//                 '${absenceDescription}',
//                 'A',
//                 '${getJadwalKaryawan.id_jadwal_kerja}',
//                 '${userId}',
//                 0,
//                 0,
//                 'M',
//                 '${getJadwalKaryawanWaktu.time_break}',
//                 '${getJadwalKaryawanWaktu.time_in}',
//                 '${getJadwalKaryawanWaktu.time_out}',
//                 'p',
//                 '${foto}',
//                 '${idAbsenTempat}',
//                 '${latitude}, ${longitude}');`),
//         );
//         return {
//             description: absenceDescription,
//             timeDifference: timeDifferenceInMinutes,
//         };
//     } else {
//         // absen will be having schedule as 'o'
//         tx.execute(
//             sql.raw(`INSERT INTO hr.absen(
//         tanggal, jam_masuk, keterangan, tipe_absen, 
//         id_jadwal_kerja, id_absen, overtimebefore, overtimeafter,
//         id_status_absen, schedule, foto_masuk, coordinate_clock_in)
//         VALUES ('${formattedDate}', '${formattedTime}', 'Masuk Tepat Waktu', 'A', 
//         '${jadwalKerjaKaryawan.id_jadwal_kerja}', '${userId}', 0, 0,
//         'M', 'o', '${foto}', '${latitude}, ${longitude}');`),
//         );

//         return {
//             description: "Masuk Tepat Waktu",
//             timeDifference: 0,
//         };
//     }
// };

// export const clockOut = async (userId: number, latitude: number, longitude: number, foto: any, tx = db) => {
//     const currentDate = new Date();
//     const options = { timeZone: "Asia/Makassar", hour12: false };
//     const formattedDate = currentDate.toLocaleDateString("en-US", options);
//     const formattedTime = currentDate.toLocaleTimeString("en-US", options);

//     const [getAbsen] = await tx.execute(sql.raw(`SELECT * FROM hr.absen WHERE id_absen=${userId} AND tanggal='${formattedDate}'`));

//     if (getAbsen.schedule != "o") {
//         const date1 = `2023-01-01T${getAbsen.jam_masuk}`;
//         const date2 = `2023-01-01T${formattedTime}`;

//         // calculate how much difference in minute between time_in and clock_in_time
//         const timeDifferenceInMinutes = differenceInMinutes(date1, date2);

//         const [getJadwalKerja] = await tx
//             .select()
//             .from(jadwalKerja)
//             .where(eq(jadwalKerja.id, getAbsen.id_jadwal_kerja as number));

//         var absenceDescription = "";

//         if (typeof timeDifferenceInMinutes === "number") {
//             absenceDescription = timeDifferenceInMinutes > getJadwalKerja.batas_pulang ? "Keluar Lebih Cepat " : "Keluar Tepat Waktu";
//         } else {
//             return undefined;
//         }

//         await tx.execute(
//             sql.raw(`
//           UPDATE hr.absen
//           SET 
//             jam_keluar='${formattedTime}', 
//             keterangan='${getAbsen.keterangan}, ${absenceDescription}', 
//             foto_keluar='${foto}',
//             coordinate_clock_out='${latitude}, ${longitude}'
//           WHERE 
//             id_absen=${userId} 
//           AND 
//             tanggal='${formattedDate}';`),
//         );

//         return {
//             description: absenceDescription,
//             timeDifference: timeDifferenceInMinutes,
//         };
//     } else {
//         // absen will be having schedule as 'o'
//         tx.execute(
//             sql.raw(`UPDATE hr.absen
//           SET 
//             jam_keluar='${formattedTime}', 
//             keterangan='Keluar Tepat Waktu', 
//             foto_keluar='${foto}',
//             coordinate_clock_out='${latitude}, ${longitude}'
//           WHERE 
//             id_absen=${userId} 
//           AND 
//             tanggal='${formattedDate}';`),
//         );

//         return {
//             description: "Masuk Tepat Waktu",
//             timeDifference: 0,
//         };
//     }
// };

// // ==========HELPER FUNCTION===========

// // Function to Calculate between two times.
// function differenceInMinutes(date1: string, date2: string) {
//     const datetime1 = new Date(date1);
//     const datetime2 = new Date(date2);

//     if (isNaN(datetime1.getTime()) || isNaN(datetime2.getTime())) {
//         return "invalid dates"; // Check for invalid dates
//     }

//     const difference = (datetime1.getTime() - datetime2.getTime()) / (1000 * 60);
//     return difference;
// }

// function toRadians(degree: number): number {
//     return degree * (Math.PI / 180);
// }

// // CALCULATE DISTANCE IN METERS BETWEEN TWO COORDINATES
// function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//     const R = 6371000; // Earth's radius in meters

//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);

//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     const distance = R * c; // Distance in meters
//     return distance;
// }
