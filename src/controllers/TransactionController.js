import { Op } from "sequelize";
import { Asset, Transaction } from "../database/models/Model.js";

export const index = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (filters["all"] == "true") {
      const transactions = await Transaction.findAll();

      return res.status(200).json({
        success: true,
        message: "Display all transactions successfully",
        data: transactions,
      });
    }

    const whereClause = {};
    const allowedFilters = [
      "transaction_id",
      "user_nrp",
      "asset_number",
      "loan_needs",
      "loanAt",
      "returnAt",
    ];

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
      }
    });

    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Display all transactions successfully",
      total_page: totalPages,
      current_page: parseInt(page),
      data: rows,
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
  const { transaction_id } = req?.params;

  if (!transaction_id) {
    return res.status(400).json({
      success: false,
      message: "Display transaction failed, Params cannot empty",
    });
  }

  try {
    const transaction = await Transaction.findByPk(transaction_id, {
      include: [
        {
          association: Transaction.associations.user,
          as: "user",
          attributes: ["name"],
        },
        {
          association: Transaction.associations.asset,
          as: "asset",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Display transaction failed, Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Display transaction successfully",
      data: transaction,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Display transaction failed",
    });
  }
};

export const store = async (req, res) => {
  const { asset_id, loan_needs, loanAt } = req?.body;

  const isEmpty = !asset_id || !loan_needs || !loanAt;

  if (isEmpty) {
    return res.status(422).json({
      success: false,
      message: "Create transaction failed, Field cannot empty",
    });
  }

  const asset = await Asset.findByPk(asset_id, {});

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Create transaction failed, Asset not found",
    });
  }

  if (asset.status !== "AV") {
    return res.status(400).json({
      success: false,
      message: "Create transaction failed, Asset not available to borrow",
    });
  }

  try {
    const transaction = await Transaction.create({
      transaction_id: req.body.transaction_id,
      user_id: req.nrp,
      asset_id,
      loan_needs,
      loanAt,
    });

    await asset.update({
      status: "NA",
    });

    res.status(201).json({
      success: true,
      message: "Create transaction successfully",
      data: transaction,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Create transaction failed",
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
