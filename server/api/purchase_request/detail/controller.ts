// import { NextFunction, Response } from "express";

// import { MyRequest } from "../../../middleware/authMiddleware";
// import { getPurchaseRequest } from "../service";
// import { getOptionPurchaseRequestDetail } from "./service";

// export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const type = req.query.type;
//         const module = req.query.module as string;
//         if (type == "option") {
//             const data = await getOptionPurchaseRequestDetail(module);
//             res.status(200).json({
//                 message: "Success Get Purchase Request",
//                 data: data,
//             });
//         } else {
//             const data = await getPurchaseRequest(req.user!.id);
//             res.status(200).json({
//                 message: "Success Get Purchase Request",
//                 data: data,
//             });
//         }
//     } catch (error) {
//         next(error);
//     }
// };
