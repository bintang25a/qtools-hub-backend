import express from "express";
import { assetReturn } from "../controllers/ActionController.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router({ mergeParams: true });

router.use(verifyUser);
router.patch("/asset-return/:transaction_id", assetReturn);

export default router;
