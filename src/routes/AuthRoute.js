import express from "express";
import { isLogin, login, logout } from "../controllers/AuthController.js";
import { verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

router.post("/login", login);
router.get("/check", verifyUser, isLogin);
router.delete("/logout", logout);

export default router;
