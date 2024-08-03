import { Router } from "express";

import { auth } from "../../middleware/authMiddleware";
import { resetDB } from "./controller";

const router = Router();

router.get("/resetDB", auth, resetDB);

export { router as devRoute };
