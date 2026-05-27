import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/RepairController.js";
import {
  verifyUser,
  plannerOnly,
  toolKeeperOnly,
} from "../middlewares/AuthUser.js";
import { generateRepairId as GRI } from "../middlewares/GenerateId.js";

const router = express.Router({ mergeParams: true });

router.use(verifyUser, toolKeeperOnly);
router.get("/", index);
router.get("/:repair_id", show);
router.post("/", GRI, store);
router.patch("/:repair_id", update);
router.delete("/:repair_id", plannerOnly, destroy);

export default router;
