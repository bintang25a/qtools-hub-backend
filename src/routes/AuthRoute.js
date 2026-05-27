import express from "express";
import { login, me, logout } from "../controllers/AuthController.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router({ mergeParams: true });

router.post("/login", login);

router.use(verifyUser);
router.delete("/logout", logout);
router.get("/me", me);

export default router;
