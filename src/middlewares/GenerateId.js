import { Op } from "sequelize";
import { Transaction } from "../database/models/Model.js";

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
