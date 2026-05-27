import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/AssetController.js";
import {
  verifyUser,
  toolKeeperOnly,
  plannerOnly,
} from "../middlewares/AuthUser.js";

const router = express.Router({ mergeParams: true });

router.use(verifyUser);
router.get("/", index);
router.get("/:asset_number", show);

router.use(toolKeeperOnly);
router.post("/", store);
router.patch("/:asset_number", update);

router.use(plannerOnly);
router.delete("/:asset_number", destroy);

export default router;
