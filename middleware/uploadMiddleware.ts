import path from "path";
import multer from "multer";
import { Request } from "express";

const fs = require("fs");

const dir = "./src/uploads/storage";
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, dir);
    },
    filename: function (req: Request, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1, // 1 MB
    },
});
