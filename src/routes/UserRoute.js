import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/UserController.js";
import {
  verifyUser,
  toolKeeperOnly,
  plannerOnly,
} from "../middlewares/AuthUser.js";
import uploadPhoto from "../middlewares/UploadUserPhoto.js";

const router = express.Router({ mergeParams: true });

router.use(verifyUser, toolKeeperOnly);
router.get("/", index);
router.get("/:nrp", show);

router.use(plannerOnly);
router.post("/", uploadPhoto.single("photo"), store);
router.patch("/:nrp", uploadPhoto.single("photo"), update);
router.delete("/:nrp", destroy);

export default router;
