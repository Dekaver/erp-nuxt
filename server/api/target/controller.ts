// import { NextFunction, Request, Response } from "express";
// import { createTarget, deleteTarget, getTarget, getTargetById, updateTarget } from "../target/service";
// import { Target, insertTargetSchema } from "../target/schema";
// import { MyRequest } from "src/middleware/authMiddleware";


// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getTarget();
//         return res.status(200).json({
//             message: "Success Get Target",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getTargetById(req.params.tahun as unknown as number, req.params.kantor as unknown as number);
//         return res.status(200).json({
//             message: "Success Get Target",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             const { id_kantor, tahun } = req.body;

//             // Mengecek data apakah sudah ada
//             const cekData = await getTargetById(tahun as unknown as number, id_kantor as unknown as number, tx);
//             if (cekData.data != null) {
//                 throw ValidationError("Target sudah ada");
//             }

//             // Membuat objek untuk validasi schema atau langsung untuk insert/update
//             const validate = insertTargetSchema.parse({
//                 id_kantor: id_kantor,
//                 tahun: parseInt(tahun),
//             }) as Target;

//             let dataTarget = await createTarget(validate, tx);

//             return { ...dataTarget };
//         });

//         return res.status(200).json({
//             message: "Success Create Target",
//             data: data,
//         });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             const { id_kantor, tahun, detail } = req.body;
//             const cekData = await getTargetById(tahun as unknown as number, id_kantor as unknown as number, tx);

//             let totalOperasional = 0;
//             let totalPendapatan = 0;

//             const extractedData = detail.reduce((acc: { [x: string]: any }, curr: { operasional: any; pendapatan: any; bulan: number }) => {
//                 const operasional = curr.operasional || 0;
//                 const pendapatan = curr.pendapatan || 0;

//                 totalOperasional += operasional;
//                 totalPendapatan += pendapatan;

//                 acc[`o${curr.bulan}`] = operasional.toString();
//                 acc[`p${curr.bulan}`] = pendapatan.toString();
//                 return acc;
//             }, {});

//             extractedData.o13 = totalOperasional.toString();
//             extractedData.p13 = totalPendapatan.toString();

//             const validate = insertTargetSchema.parse({
//                 id_kantor: parseInt(id_kantor),
//                 tahun: parseInt(tahun),
//                 ...extractedData,
//             }) as Target;

//             let data = await updateTarget(tahun as unknown as number, id_kantor as unknown as number, validate, tx);

//             return { ...data };
//         });

//         return res.status(200).json({
//             message: "Success Create Target",
//             data: data,
//         });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             const data = await deleteTarget(parseInt(req.params.tahun), parseInt(req.params.kantor), tx);
//             return { ...data };
//         });
//         return res.status(200).json({
//             message: "Success Delete Target",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
