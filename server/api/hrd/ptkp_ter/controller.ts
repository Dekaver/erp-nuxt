// import { NextFunction, Response } from "express";
// import { MyRequest } from "../../../middleware/authMiddleware";
// import { ToString } from "../../../libs/formater";
// import { ValidationError } from "../../../libs/errors";

// import { NewPtkpTer, insertPtkpTerSchema, ptkpTer } from "./schema";
// import { getPtkpTer, getOptionPtkpTer, getPtkpTerById, createPtkpTer, updatePtkpTer, deletePtkpTer, getTerForMapping } from "./service";
// import { eq } from "drizzle-orm";

// export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getPtkpTer(req.params.id_ptkp as unknown as number);
//         return res.status(200).json({
//             message: "Success Get TER PTKP",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getOptionPtkpTer();
//         return res.status(200).json({
//             message: "Success Get TER PTKP",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getPtkpTerById(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get TER PTKP",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const save = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ter, id_ptkp, ...rest } = req.body;

//         const data = await db.transaction(async (tx) => {
//             await tx.delete(ptkpTer).where(eq(ptkpTer.id_ptkp, id_ptkp));
//             const validatePtkpTer = ter.map((item: NewPtkpTer, index: number) => {
//                 return insertPtkpTerSchema.parse({
//                     id_ter: item.id,
//                     id_ptkp: id_ptkp,
//                 });
//             });
//             let dataQuery;
//             if (validatePtkpTer.length > 0) {
//                 dataQuery = await createPtkpTer(validatePtkpTer, tx);
//             }

//             return { ...dataQuery };
//         });

//         return res.status(200).json({
//             message: "Success Create TER PTKP",
//             data: data,
//         });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

// export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     try {
//         const data = await deletePtkpTer(parseInt(id));
//         return res.status(200).json({
//             message: "Success Delete TER PTKP",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const terForMapping = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getTerForMapping(req.params.id_ptkp as unknown as number);
//         return res.status(200).json({
//             message: "Success Get TER PTKP",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
