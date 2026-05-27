import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/UserController.js";
import { verifyUser, adminOnly } from "../middlewares/AuthUser.js";
import uploadPhoto from "../middlewares/UploadUserPhoto.js";

const router = express.Router({ mergeParams: true });

router.use(verifyUser);
router.get("/", index);
router.get("/:uid", show);
router.post("/", adminOnly, uploadPhoto.single("photo"), store);
router.patch("/:uid", uploadPhoto.single("photo"), update);
router.delete("/:uid", adminOnly, destroy);

export default router;
