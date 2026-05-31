import { Op } from "sequelize";
import { User } from "../database/models/Model.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export const index = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (filters["all"] == "true") {
      const users = await User.findAll();

      return res.status(200).json({
        success: true,
        message: "Display all users successfully",
        data: users,
      });
    }

    const allowedFilters = ["nrp", "name", "role"];
    const whereClause = {};

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        if (["name", "nrp"].includes(key)) {
          whereClause[key] = { [Op.like]: `%${filters[key]}%` };
        } else {
          whereClause[key] = filters[key];
        }
      }
    });

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Display all users successfully",
      total_page: totalPages,
      current_page: parseInt(page),
      data: rows,
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
  const { nrp } = req?.params;

  if (!nrp) {
    return res.status(400).json({
      success: false,
      message: "Display user failed, Params cannot empty",
    });
  }

  try {
    const user = await User.findByPk(nrp, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          association: User.associations.transactions,
          as: "transactions",
          attributes: ["transaction_id", "loanAt", "returnAt"],
        },
        {
          association: User.associations.reports,
          as: "reports",
          attributes: ["report_id", "createdAt"],
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
  const { nrp, name, role } = req?.body;

  if (!nrp || !name || !role) {
    return res.status(400).json({
      success: false,
      message: "Create user failed, Field cannot empty",
    });
  }

  const user = await User.findByPk(nrp, {});

  if (user) {
    return res.status(400).json({
      success: false,
      message: "Create user failed, User already exist",
    });
  }

  const photo = req.file ? req.file.filename : null;

  const invalid = {
    role: role !== "planner" && role !== "tool keeper" && role !== "mechanic",
    nrp: nrp.length > 24,
  };

  if (invalid?.role || invalid?.nrp) {
    return res.status(422).json({
      success: false,
      message: "Create user failed, Unprocessable content",
    });
  }

  const hashPassword = await bcrypt.hash(nrp.toLowerCase(), 10);

  try {
    const tempUser = await User.create({
      nrp: nrp.toUpperCase(),
      name,
      role,
      password: hashPassword,
      photo,
    });

    const { password, ...user } = tempUser?.toJSON();

    res.status(201).json({
      success: true,
      message: "Create user successfully",
      data: user,
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
  const { nrp } = req?.params;

  if (!nrp) {
    return res.status(400).json({
      success: false,
      message: "Update user failed, Params cannot empty",
    });
  }

  const { name, role, password } = req.body;

  const user = await User.findByPk(nrp, {});

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Update user failed, User not found",
    });
  }

  if (!name || !role) {
    return res.status(400).json({
      success: true,
      message: "Update user failed, Field cannot empty",
    });
  }

  if (role !== "planner" && role !== "tool keeper" && role !== "mechanic") {
    return res.status(400).json({
      success: false,
      message: "Update user failed, Invalid role option",
    });
  }

  const hashPassword = !password
    ? user?.password
    : await bcrypt.hash(password, 10);

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

    await user.update({
      nrp,
      name,
      role,
      password: hashPassword,
      photo,
    });

    const { password, ...newUser } = user?.toJSON();

    res.status(200).json({
      success: true,
      message: "Update user successfully",
      data: newUser,
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
  const { nrp } = req?.params;

  if (!nrp) {
    return res.status(400).json({
      success: false,
      message: "Delete user failed, Params cannot empty",
    });
  }

  const user = await User.findByPk(nrp, {});

  if (!user) {
    return res.status(404).json({
      success: false,
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
        nrp,
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
