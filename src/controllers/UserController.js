import { User } from "../database/models/Model.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export const index = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: req.role == "Admin" ? [] : ["password"],
      },
      include: [
        {
          association: User.associations.classrooms,
          as: "classrooms",
          through: {
            attributes: [],
          },
        },
        {
          association: User.associations.assists,
          as: "assists",
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Display all users successfully",
      data: users,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display all users failed",
    });
  }
};

export const show = async (req, res) => {
  const { uid } = req?.params;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "Display user failed, Params cannot empty",
    });
  }

  try {
    const user = await User.findByPk(uid, {
      attributes: {
        exclude: req.role == "Admin" ? [] : ["password"],
      },
      include: [
        {
          association:
            req.role === "Praktikan"
              ? User.associations.classrooms
              : User.associations.assists,
          as: req.role === "Praktikan" ? "classrooms" : "assists",
          attributes: ["class_code", "name"],
          through: { attributes: [] },
          include: [
            {
              association: "assistants",
              attributes: ["uid", "name"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Display user failed, User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Display user successfully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display user failed",
    });
  }
};

export const store = async (req, res) => {
  const { uid, name, phone_number, email, role, password } = req?.body;

  if (!uid || !name || !phone_number || !email || !role || !password) {
    return res.status(400).json({
      success: false,
      message: "Create user failed, Field cannot empty",
    });
  }

  const user = await User.findOne({
    where: {
      uid,
    },
  });

  if (user) {
    return res.status(400).json({
      success: false,
      message: "Create user failed, User already exist",
    });
  }

  const photo = req.file ? req.file.filename : null;

  if (role !== "Praktikan" && role !== "Asisten" && role !== "Admin") {
    return res.status(400).json({
      success: false,
      message: "Create user failed, Invalid role option",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      uid,
      name,
      phone_number,
      email,
      role,
      password: hashPassword,
      photo,
    });

    res.status(201).json({
      success: true,
      message: "Create user successfully",
      data: uid,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Create user failed",
    });
  }
};

export const update = async (req, res) => {
  const { uid } = req?.params;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "Update user failed, Params cannot empty",
    });
  }

  const { name, phone_number, email, role, password } = req.body;

  const user = await User.findByPk(uid, {});

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Update user failed, User not found",
    });
  }

  if (!name || !phone_number || !email || !role) {
    return res.status(400).json({
      success: true,
      message: "Update user failed, Field cannot empty",
    });
  }

  if (role !== "Praktikan" && role !== "Asisten" && role !== "Admin") {
    return res.status(400).json({
      success: false,
      message: "Update user failed, Invalid role option",
    });
  }

  let hashPassword;
  if (!password) {
    hashPassword = user.password;
  } else {
    hashPassword = await bcrypt.hash(password, 10);
  }

  try {
    let photo = user.photo;
    if (req.file) {
      photo = req.file.filename;

      if (user.photo) {
        const oldFilePath = path.join("public/profiles", user.photo);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await user.update(
      {
        name,
        phone_number,
        email,
        role,
        password: hashPassword,
        photo,
      },
      {
        where: {
          uid,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Update user successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Update user failed",
    });
  }
};

export const destroy = async (req, res) => {
  const { uid } = req?.params;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "Delete user failed, Params cannot empty",
    });
  }

  const user = await User.findByPk(uid, {});

  if (!user) {
    return res.status(404).json({
      success: true,
      message: "Delete user failed, User not found",
    });
  }

  try {
    if (user.photo) {
      const oldFilePath = path.join("public/profiles", user.photo);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await User.destroy({
      where: {
        uid,
      },
    });

    res.status(200).json({
      success: true,
      message: "Delete user successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Delete user failed",
    });
  }
};
