import { Op } from "sequelize";
import { Tool, Inspection, Asset } from "../database/models/Model.js";

export const index = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (filters["all"] == "true") {
      const inspections = await Inspection.findAll();

      return res.status(200).json({
        success: true,
        message: "Display all inspections successfully",
        data: inspections,
      });
    }

    const whereClause = {};
    const allowedFilters = ["Inspection_id", "asset_id", "user_id"];

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
      }
    });

    const { count, rows } = await Inspection.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Display all inspections successfully",
      total_page: totalPages,
      current_page: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display all inspections failed",
    });
  }
};

export const indexByUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    const transactions = await Inspection.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Display all transactions successfully",
      data: transactions,
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
  const { inspection_id } = req?.params;

  if (!inspection_id) {
    return res.status(400).json({
      success: false,
      message: "Display inspection failed, Params cannot empty",
    });
  }

  try {
    const inspection = await Inspection.findByPk(inspection_id, {});

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Display inspection failed, Inspection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Display inspection successfully",
      data: inspection,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display inspection failed",
    });
  }
};

export const store = async (req, res) => {
  const { asset_id, inspectionAt, tools } = req?.body;

  const isEmpty = !asset_id || !inspectionAt;

  if (isEmpty) {
    return res.status(422).json({
      success: false,
      message: "Create inspection failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(asset_id, {});

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Create inspection failed, Asset not found",
    });
  }

  try {
    const id = req.body.inspection_id;

    const inspection = await Inspection.create({
      inspection_id: id,
      user_id: req.nrp,
      asset_id,
      inspectionAt,
    });

    await Tool.bulkCreate([]);

    res.status(201).json({
      success: true,
      message: "Create inspection successfully",
      data: inspection,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Create inspection failed",
    });
  }
};

export const update = async (req, res) => {
  const { transaction_id } = req?.params;

  if (!transaction_id) {
    return res.status(400).json({
      success: false,
      message: "Update transaction failed, Params cannot empty",
    });
  }

  const { user_id, asset_id, loan_needs, loanAt, returnAt } = req?.body;

  const transaction = await Transaction.findByPk(transaction_id, {});

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Update transaction failed, Transaction not found",
    });
  }

  const isEmpty = !user_id || !asset_id || !loan_needs || !loanAt;

  if (isEmpty) {
    return res.status(422).json({
      success: false,
      message: "Update transaction failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(transaction.asset_id, {});

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Create transaction failed, Asset not found",
    });
  }

  try {
    await transaction.update({
      user_id,
      asset_id,
      loan_needs,
      loanAt,
      returnAt,
    });

    res.status(200).json({
      success: true,
      message: "Update transaction successfully",
      data: transaction,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Update transaction failed",
    });
  }
};

export const destroy = async (req, res) => {
  const { transaction_id } = req?.params;

  if (!transaction_id) {
    return res.status(400).json({
      success: false,
      message: "Delete transaction failed, Params cannot empty",
    });
  }

  const transaction = await Transaction.findByPk(transaction_id, {});

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Delete transaction failed, Transaction not found",
    });
  }

  try {
    await Transaction.destroy({
      where: {
        transaction_id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Delete transaction successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Delete transaction_ failed",
    });
  }
};
