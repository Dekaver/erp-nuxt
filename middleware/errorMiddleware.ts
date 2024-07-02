import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { PostgresError } from "postgres";
import { z } from "zod";
import { formatCapitalizeString } from "../libs/formater";

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.format(), message: error.format() });
    } else if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File too large" });
        }
        return res.status(400).json({ message: "Error uploading file" });
    } else if (error.name === "ValidationError") {
        // Handle validation errors from custom error classes
        return res.status(400).json({ message: error.message });
    } else if (error.name === "NotFoundError") {
        // Handle not found errors from custom error classes
        return res.status(404).json({ message: error.message });
    } else if (error instanceof PostgresError && error.code === "23503") {
        // This error code '23503' corresponds to a foreign key constraint violation.
        // You can provide a custom error message here.
        return res.status(400).json({
            message: `Data ini tidak bisa dihapus. Karena ada relasi dengan data lain.`,
        });
    } else if (error instanceof PostgresError && error.code === "23505") {
        // This error code '23505' corresponds to duplicate key value violates unique constraint.
        // You can provide a custom error message here.
        console.log(error, "ni error");
        return res.status(400).json({
            message: `Ada data duplikat mohon dicek kembali!`,
        });
    } else {
        // Handle other unexpected errors
        console.error("Unhandled error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
//     // if (error instanceof z.ZodError) {
//     //   // Handle Zod validation errors
//     //   const errorMessage = error.errors.map((err) => err.message).join(", ");
//     //   return res.status(400).json({ error: error });
//     // }

//     if (error instanceof z.ZodError) {
//         console.error("ZOD Error: ", error);
//         return res.status(400).json({ error: error.format(), message: error.format() });
//     } else if (error instanceof multer.MulterError) {
//         console.error("Multer Error: ", error);
//         if (error.code === "LIMIT_FILE_SIZE") {
//             return res.status(400).json({ message: "File too large" });
//         }
//         return res.status(400).json({ message: "Error uploading file" });
//     } else if (error.name === "ValidationError") {
//         console.error("Validate Error: ", error);
//         // Handle validation errors from custom error classes
//         return res.status(400).json({ message: error.message });
//     } else if (error.name === "NotFoundError") {
//         console.error("Not Found Error: ", error);
//         // Handle not found errors from custom error classes
//         return res.status(404).json({ message: error.message });
//     } else if (error instanceof PostgresError && error.code === "23503") {
//         // This error code '23503' corresponds to a foreign key constraint violation.
//         // You can provide a custom error message here.
//         console.error(error, "ini error");
//         return res.status(400).json({
//             message: 'Tidak Dapat diubah/dihapus karena sudah digunakan'
//             // message: `Cannot delete this ${formatCapitalizeString(error.table_name!)} because it is referenced by other records.`,
//         });
//     } else {
//         // Handle other unexpected errors
//         console.error("Unhandled error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };
