import { Op } from "sequelize";
import { Transaction, Repair, Inspection } from "../database/models/Model.js";

export const generateTransactionId = async (req, res, next) => {
  try {
    const now = new Date();
    const day = now.getDate();

    let prefix = "";
    if (day <= 26) {
      prefix = String.fromCharCode(64 + day);
    } else {
      prefix = `A${String.fromCharCode(64 + (day - 26))}`;
    }

    const lastTransaction = await Transaction.findOne({
      where: {
        transaction_id: { [Op.like]: `${prefix}-%` },
      },
      order: [["transaction_id", "DESC"]],
    });

    let nextNumber = 1;
    if (lastTransaction) {
      const parts = lastTransaction.transaction_id.split("-");
      nextNumber = parseInt(parts[1]) + 1;
    }

    req.body.transaction_id = `${prefix}-${nextNumber
      .toString()
      .padStart(5, "0")}`;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal generate ID", error: error.message });
  }
};

export const generateRepairId = async (req, res, next) => {
  try {
    const { asset_id } = req.body;

    if (!asset_id) {
      return res.status(400).json({
        success: false,
        message: "asset_id diperlukan untuk generate ID",
      });
    }

    const prefix = `RP-${asset_id}`;

    const lastRepair = await Repair.findOne({
      where: {
        repair_id: { [Op.like]: `${prefix}-%` },
      },
      order: [["repair_id", "DESC"]],
    });

    let nextNumber = 1;
    if (lastRepair) {
      const parts = lastRepair.repair_id.split("-");
      nextNumber = parseInt(parts[2]) + 1;
    }

    req.body.repair_id = `${prefix}-${nextNumber.toString().padStart(5, "0")}`;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal generate ID", error: error.message });
  }
};

export const generateInspectionId = async (req, res, next) => {
  try {
    const now = new Date();
    const day = now.getDate();

    let prefix = "";
    if (day <= 26) {
      prefix = String.fromCharCode(64 + day);
    } else {
      prefix = `A${String.fromCharCode(64 + (day - 26))}`;
    }

    const lastInspection = await Inspection.findOne({
      where: {
        inspection_id: { [Op.like]: `${prefix}-%` },
      },
      order: [["inspection_id", "DESC"]],
    });

    let nextNumber = 1;
    if (lastInspection) {
      const parts = lastInspection.inspection_id.split("-");
      nextNumber = parseInt(parts[1]) + 1;
    }

    req.body.inspection_id = `${prefix}-${nextNumber
      .toString()
      .padStart(5, "0")}`;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal generate ID", error: error.message });
  }
};
