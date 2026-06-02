import { Op } from "sequelize";
import { Asset, Report } from "../database/models/Model.js";

export const index = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (filters["all"] == "true") {
      const reports = await Report.findAll();

      return res.status(200).json({
        success: true,
        message: "Display all reports successfully",
        data: reports,
      });
    }

    const whereClause = {};
    const allowedFilters = ["reporter_id", "asset_id", "description"];

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
      }
    });

    const { count, rows } = await Report.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: Report.associations.reporter,
          as: "reporter",
          attributes: ["name"],
        },
        {
          association: Report.associations.asset,
          as: "asset",
          attributes: ["description"],
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Display all reports successfully",
      total_page: totalPages,
      current_page: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display all reports failed",
    });
  }
};

export const show = async (req, res) => {
  const { report_id } = req?.params;

  if (!report_id) {
    return res.status(400).json({
      success: false,
      message: "Display report failed, Params cannot empty",
    });
  }

  try {
    const report = await Report.findByPk(report_id, {
      include: [
        {
          association: Report.associations.reporter,
          as: "reporter",
          attributes: ["name"],
        },
        {
          association: Report.associations.asset,
          as: "asset",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Display report failed, Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Display report successfully",
      data: report,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display report failed",
    });
  }
};

export const store = async (req, res) => {
  const { asset_id, description } = req?.body;

  const isEmpty = !asset_id || !description;

  if (isEmpty) {
    return res.status(400).json({
      success: false,
      message: "Create report failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(asset_id, {});

  if (!asset) {
    return res.status(400).json({
      success: false,
      message: "Create report failed, Asset not found",
    });
  }

  try {
    const report = await Report.create({
      reporter_id: req.nrp,
      description,
      asset_id,
    });

    res.status(201).json({
      success: true,
      message: "Create report successfully",
      data: report,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Create report failed",
    });
  }
};

export const update = async (req, res) => {
  const { report_id } = req?.params;

  if (!report_id) {
    return res.status(400).json({
      success: false,
      message: "Update report failed, Params cannot empty",
    });
  }

  const { asset_id, description } = req?.body;

  const report = await Report.findByPk(report_id, {});

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "Update report failed, Report not found",
    });
  }

  if (!asset_id || !description) {
    return res.status(400).json({
      success: false,
      message: "Update report failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(asset_id, {});

  if (!asset) {
    return res.status(400).json({
      success: false,
      message: "Create report failed, Asset not found",
    });
  }

  try {
    await report.update({
      asset_id,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Update report successfully",
      data: report,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Update report failed",
    });
  }
};

export const destroy = async (req, res) => {
  const { report_id } = req?.params;

  if (!report_id) {
    return res.status(400).json({
      success: false,
      message: "Delete report failed, Params cannot empty",
    });
  }

  const report = await Report.findByPk(report_id, {});

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "Delete report failed, Report not found",
    });
  }

  try {
    await Report.destroy({
      where: {
        report_id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Delete report successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Delete report failed",
    });
  }
};
