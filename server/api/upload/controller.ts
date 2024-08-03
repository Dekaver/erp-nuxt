import { NextFunction, Request, Response } from "express";
import fs from "fs";

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            message: "Upload success",
            data: req.file,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const path = `src/uploads/trash/${req.params.filename}`;

        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(err);
                return res.status(404).json({
                    message: "File not found",
                });
            }

            //file exists
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Failed to delete file",
                    });
                }
                //file removed
                console.log("File removed");
                return res.status(200).json({
                    message: "Delete File success",
                });
            });
        });
    } catch (error) {
        next(error);
    }
};
