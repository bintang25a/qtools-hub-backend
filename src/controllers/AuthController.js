import { User, Token } from "../database/models/Model.js";
import bcrypt from "bcrypt";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs";

export const login = async (req, res) => {
  const { nrp, password } = req.body;

  if (!nrp || !password) {
    return res.status(400).json({
      success: false,
      message: "Login failed, Field cannot empty",
    });
  }

  const user = await User.findByPk(nrp, {});

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Login failed, User not found",
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({
      success: false,
      message: "Login failed, Wrong password!",
    });
  }

  const payload = {
    nrp: user.nrp,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const decoded = jwt.decode(token);
  const exp = decoded?.exp
    ? decoded.exp * 1000
    : Date.now() + 24 * 60 * 60 * 1000;

  await Token.create({
    token,
    expiredAt: new Date(exp),
  });

  const tempDir = path.join(process.cwd(), "temp", user.nrp);

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  return res.status(200).json({
    success: true,
    message: "Login successfully",
    data: {
      nrp: user.nrp,
      name: user.name,
      role: user.role,
      token,
    },
  });
};

export const me = async (req, res) => {
  const tempUser = await User.findByPk(req.nrp, {});

  if (!tempUser) {
    return res.status(404).json({
      success: false,
      message: "Get user failed, User not found",
    });
  }

  const { password, ...user } = tempUser.toJSON();

  user.photo_url = tempUser?.photo
    ? `${process.env.APP_URL}/uploads/profiles/${user?.photo}`
    : null;

  return res.status(200).json({
    success: true,
    message: "Get user successfully",
    data: user,
  });
};

export const logout = async (req, res) => {
  await Token.destroy({
    where: {
      token: req.activeToken,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
};
