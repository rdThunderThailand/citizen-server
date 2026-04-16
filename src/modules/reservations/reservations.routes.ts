import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { reservationsController } from "./reservations.controller.js";

const router = Router();
router.get("/", requireAuth, reservationsController.list);
export default router;
