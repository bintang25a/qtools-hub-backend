import { Token } from "../database/models/Model.js";
import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const activeToken = authHeader && authHeader.split(" ")[1];

  if (!activeToken || !authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied, Unuthorized!",
    });
  }

  const token = await Token.findOne({
    where: {
      token: activeToken,
    },
  });

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, Unuthorized!",
    });
  }

  try {
    const decoded = jwt.verify(activeToken, process.env.JWT_SECRET);

    req.uid = decoded.uid;
    req.role = decoded.role;
    req.user = decoded;

    next();
  } catch (error) {
    await Token.destroy({
      where: {
        token: activeToken,
      },
    });

    return res.status(403).json({
      success: false,
      message: "Access denied, Invalid or expired token!",
    });
  }
};

export const assistantOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied, Unuthorized!",
    });
  }

  if (req.role != "Admin" && req.role != "Asisten") {
    return res.status(403).json({
      success: false,
      message: "Access denied, Assistant only",
    });
  }

  next();
};

export const adminOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied, Unuthorized!",
    });
  }

  if (req.role != "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied, Admin only",
    });
  }

  next();
};
