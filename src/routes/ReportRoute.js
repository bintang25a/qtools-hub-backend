import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/ReportController.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router({ mergeParams: true });

router.use(verifyUser);
router.get("/", index);
router.get("/:report_id", show);
router.post("/", store);
router.patch("/:report_id", update);
router.delete("/:report_id", destroy);

export default router;
