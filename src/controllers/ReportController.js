import { Op } from "sequelize";
import { Asset, Report } from "../database/models/Model.js";
import fs from "fs";
import path from "path";

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
    const allowedFilters = [
      "reporter_id",
      "asset_id",
      "description",
      "remark1",
      "remark2",
      "follow_up",
      "group_leader_id",
      "planner_id",
      "plant_engineer_id",
      "section_head_id",
      "dept_head_id",
    ];

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
          association: Report.associations.groupLeader,
          as: "groupLeader",
          attributes: ["name"],
        },
        {
          association: Report.associations.planner,
          as: "planner",
          attributes: ["name"],
        },
        {
          association: Report.associations.plantEngineer,
          as: "plantEngineer",
          attributes: ["name"],
        },
        {
          association: Report.associations.sectionHead,
          as: "sectionHead",
          attributes: ["name"],
        },
        {
          association: Report.associations.deptHead,
          as: "deptHead",
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

export const indexByUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    const reports = await Report.findAll({
      where: { reporter_id: user_id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Display all reports successfully",
      data: reports,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display all transactions failed",
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
          association: Report.associations.groupLeader,
          as: "groupLeader",
          attributes: ["name"],
        },
        {
          association: Report.associations.planner,
          as: "planner",
          attributes: ["name"],
        },
        {
          association: Report.associations.plantEngineer,
          as: "plantEngineer",
          attributes: ["name"],
        },
        {
          association: Report.associations.sectionHead,
          as: "sectionHead",
          attributes: ["name"],
        },
        {
          association: Report.associations.deptHead,
          as: "deptHead",
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

    const reportJson = report.toJSON();

    reportJson.evidence1_url = report.evidence1
      ? `${process.env.APP_URL}/uploads/evidences/${report.evidence1}`
      : null;

    reportJson.evidence2_url = report.evidence2
      ? `${process.env.APP_URL}/uploads/evidences/${report.evidence2}`
      : null;

    res.status(200).json({
      success: true,
      message: "Display report successfully",
      data: reportJson,
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
  const {
    asset_id,
    description,
    remark1,
    remark2,
    follow_up,
    group_leader_id,
    planner_id,
    plant_engineer_id,
    section_head_id,
    dept_head_id,
  } = req?.body;

  const isEmpty =
    !asset_id ||
    !description ||
    !remark1 ||
    !follow_up ||
    !group_leader_id ||
    !planner_id ||
    !plant_engineer_id ||
    !section_head_id ||
    !dept_head_id;

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

  const evidence1 = req.files?.evidence1?.[0]?.filename || null;
  const evidence2 = req.files?.evidence2?.[0]?.filename || null;

  try {
    const report = await Report.create({
      reporter_id: req.nrp,
      asset_id,
      description,
      evidence1,
      remark1,
      evidence2,
      remark2,
      follow_up,
      group_leader_id,
      planner_id,
      plant_engineer_id,
      section_head_id,
      dept_head_id,
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

  const {
    asset_id,
    description,
    remark1,
    remark2,
    follow_up,
    group_leader_id,
    planner_id,
    plant_engineer_id,
    section_head_id,
    dept_head_id,
  } = req?.body;

  const isEmpty =
    !asset_id ||
    !description ||
    !remark1 ||
    !follow_up ||
    !group_leader_id ||
    !planner_id ||
    !plant_engineer_id ||
    !section_head_id ||
    !dept_head_id;

  const report = await Report.findByPk(report_id, {});

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "Update report failed, Report not found",
    });
  }

  if (isEmpty) {
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
    let evidence1 = report?.evidence1;
    let evidence2 = report?.evidence2;

    if (req.file) {
      evidence1 = req.files?.evidence1?.[0]?.filename || null;
      evidence2 = req.files?.evidence2?.[0]?.filename || null;

      if (report?.evidence1) {
        const oldFilePath = path.join("public/evidences", report?.evidence1);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      if (report?.evidence2) {
        const oldFilePath = path.join("public/evidences", report?.evidence2);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await report.update({
      asset_id,
      description,
      evidence1,
      remark1,
      evidence2,
      remark2,
      follow_up,
      group_leader_id,
      planner_id,
      plant_engineer_id,
      section_head_id,
      dept_head_id,
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
    if (report?.evidence1) {
      const oldFilePath = path.join("public/evidences", report?.evidence1);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    if (report?.evidence2) {
      const oldFilePath = path.join("public/evidences", report?.evidence2);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

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
