import { Op } from "sequelize";
import { Tool } from "../database/models/Model.js";

export const index = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (filters["all"] == "true") {
      const assets = await Tool.findAll();

      return res.status(200).json({
        success: true,
        message: "Display all assets successfully",
        data: assets,
      });
    }

    const whereClause = {};
    const allowedFilters = [
      "tool_number",
      "name",
      "specification",
      "stock_code",
    ];

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
      }
    });

    const { count, rows } = await Tool.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Display all tools successfully",
      total_page: totalPages,
      current_page: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display all tools failed",
    });
  }
};

export const show = async (req, res) => {
  const { tool_number } = req?.params;

  if (!tool_number) {
    return res.status(400).json({
      success: false,
      message: "Display tool failed, Params cannot empty",
    });
  }

  try {
    const tool = await Tool.findByPk(tool_number, {});

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Display tool failed, Tool not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Display tool successfully",
      data: tool,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display tool failed",
    });
  }
};

export const store = async (req, res) => {
  const { tool_number, name, specification, stock_code } = req?.body;

  const isEmpty = !tool_number || !name || !specification || !stock_code;

  if (isEmpty) {
    return res.status(422).json({
      success: false,
      message: "Create tool failed, Field cannot empty",
    });
  }

  const tool = await Tool.findByPk(tool_number, {});

  if (tool) {
    return res.status(422).json({
      success: false,
      message: "Create tool failed, Tool already exist",
    });
  }

  try {
    const tool = await Tool.create({
      tool_number,
      name,
      specification,
      stock_code,
    });

    res.status(201).json({
      success: true,
      message: "Create tool successfully",
      data: tool,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Create tool failed",
    });
  }
};

export const update = async (req, res) => {
  const { tool_number } = req?.params;

  if (!tool_number) {
    return res.status(400).json({
      success: false,
      message: "Update tool failed, Params cannot empty",
    });
  }

  const { name, specification, stock_code } = req?.body;

  const tool = await Tool.findByPk(tool_number, {});

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: "Update tool failed, Tool not found",
    });
  }

  const isEmpty = !name || !specification || !stock_code;

  if (isEmpty) {
    return res.status(422).json({
      success: true,
      message: "Update tool failed, Field cannot empty",
    });
  }

  try {
    await tool.update({
      name,
      specification,
      stock_code,
    });

    res.status(200).json({
      success: true,
      message: "Update tool successfully",
      data: tool,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Update tool failed",
    });
  }
};

export const destroy = async (req, res) => {
  const { tool_number } = req?.params;

  if (!tool_number) {
    return res.status(400).json({
      success: false,
      message: "Delete tool failed, Params cannot empty",
    });
  }

  const tool = await Tool.findByPk(tool_number, {});

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: "Delete tool failed, Tool not found",
    });
  }

  try {
    await Tool.destroy({
      where: {
        tool_number,
      },
    });

    res.status(200).json({
      success: true,
      message: "Delete tool successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Delete tool failed",
    });
  }
};
