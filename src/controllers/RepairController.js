import { Op } from "sequelize";
import { Asset, Repair } from "../database/models/Model.js";

export const index = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (filters["all"] == "true") {
      const repairs = await Repair.findAll();

      return res.status(200).json({
        success: true,
        message: "Display all repairs successfully",
        data: repairs,
      });
    }

    const whereClause = {};
    const allowedFilters = [
      "repair_id",
      "asset_id",
      "repairAt",
      "finishAt",
      "notes",
    ];

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
      }
    });

    const { count, rows } = await Repair.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Display all repairs successfully",
      total_page: totalPages,
      current_page: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display all repairs failed",
    });
  }
};

export const show = async (req, res) => {
  const { repair_id } = req?.params;

  if (!repair_id) {
    return res.status(400).json({
      success: false,
      message: "Display repair failed, Params cannot empty",
    });
  }

  try {
    const repair = await Repair.findByPk(repair_id, {
      include: [
        {
          association: Repair.associations.asset,
          as: "asset",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Display repair failed, Repair not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Display repair successfully",
      data: repair,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display repair failed",
    });
  }
};

export const store = async (req, res) => {
  const { asset_id, repairAt, finishAt, notes } = req?.body;

  const isEmpty = !asset_id || !repairAt;

  if (isEmpty) {
    return res.status(400).json({
      success: false,
      message: "Create repair failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(asset_id, {});

  if (!asset) {
    return res.status(400).json({
      success: false,
      message: "Create repair failed, Asset not found",
    });
  }

  if (asset.status !== "AV") {
    return res.status(400).json({
      success: false,
      message: "Create repair failed, Asset not available to repair",
    });
  }

  try {
    const repair = await Repair.create({
      repair_id: req.body.repair_id,
      asset_id,
      repairAt,
      finishAt,
      notes,
    });

    if (!finishAt) {
      await asset.update({
        status: "REPAIR",
      });
    }

    res.status(201).json({
      success: true,
      message: "Create repair successfully",
      data: repair,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Create repair failed",
    });
  }
};

export const update = async (req, res) => {
  const { repair_id } = req?.params;

  if (!repair_id) {
    return res.status(400).json({
      success: false,
      message: "Update repair failed, Params cannot empty",
    });
  }

  const { repairAt, finishAt, notes } = req?.body;

  const isEmpty = !asset_id || !repairAt;

  if (isEmpty) {
    return res.status(400).json({
      success: false,
      message: "Create repair failed, Field cannot empty",
    });
  }

  const repair = await Repair.findByPk(repair_id, {});

  if (!repair) {
    return res.status(404).json({
      success: false,
      message: "Update repair failed, Repair not found",
    });
  }

  if (!finishAt) {
    return res.status(400).json({
      success: false,
      message: "Update repair failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(repair.asset_id, {});

  if (!asset) {
    return res.status(400).json({
      success: false,
      message: "Update repair failed, Asset not found",
    });
  }

  try {
    if (finishAt) {
      await asset.update({
        status: "AV",
      });
    }

    await repair.update({
      repairAt,
      finishAt,
      notes,
    });

    res.status(200).json({
      success: true,
      message: "Update repair successfully",
      data: repair,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Update repair failed",
    });
  }
};

export const destroy = async (req, res) => {
  const { repair_id } = req?.params;

  if (!repair_id) {
    return res.status(400).json({
      success: false,
      message: "Delete repair failed, Params cannot empty",
    });
  }

  const repair = await Repair.findByPk(repair_id, {});

  if (!repair) {
    return res.status(404).json({
      success: false,
      message: "Delete repair failed, Repair not found",
    });
  }

  try {
    await Repair.destroy({
      where: {
        repair_id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Delete repair successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Delete repair failed",
    });
  }
};
