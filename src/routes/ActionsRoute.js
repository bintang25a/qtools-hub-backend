import express from "express";
import {
  run,
  autoGrade,
  grade,
  downloadSubmissions,
} from "../controllers/ActionsController.js";
import { verifyUser, assistantOnly } from "../middlewares/AuthUser.js";

const router = express.Router();

router.use(verifyUser);
router.post("/run", run);
router.post("/grade", assistantOnly, grade);
router.post("/auto-grade", assistantOnly, autoGrade);
router.get("/downloads/:assignment_number", assistantOnly, downloadSubmissions);

export default router;
