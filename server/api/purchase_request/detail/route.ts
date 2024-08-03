import { Router } from "express";

import { auth } from "../../../middleware/authMiddleware";
import { index } from "./controller";

const router = Router().use(auth);

router.get("/", index);

export { router as purchaseRequestDetailRoute };
