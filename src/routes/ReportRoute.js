import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
  indexByUser,
} from "../controllers/ReportController.js";
import { verifyUser } from "../middlewares/AuthUser.js";
import uploadEvidence from "../middlewares/UploadEvidenceImage.js";

const router = express.Router({ mergeParams: true });

const evidence = [
  { name: "evidence1", maxCount: 1 },
  { name: "evidence2", maxCount: 1 },
];

router.use(verifyUser);
router.get("/", index);
router.get("/byUser", indexByUser);
router.get("/:report_id", show);
router.post("/", uploadEvidence.fields(evidence), store);
router.patch("/:report_id", update);
router.delete("/:report_id", destroy);

export default router;
