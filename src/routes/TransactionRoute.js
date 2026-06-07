import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
  indexByUser,
} from "../controllers/TransactionController.js";
import { verifyUser, plannerOnly } from "../middlewares/AuthUser.js";
import { generateTransactionId as GTI } from "../middlewares/GenerateId.js";

const router = express.Router({ mergeParams: true });

router.use(verifyUser);
router.get("/", plannerOnly, index);
router.get("/byUser", indexByUser);
router.get("/:transaction_id", show);
router.post("/", GTI, store);
router.patch("/:transaction_id", update);
router.delete("/:transaction_id", plannerOnly, destroy);

export default router;
