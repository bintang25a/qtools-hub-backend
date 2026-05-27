import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const Transaction = db.define("transactions", {
  transaction_id: {
    type: DataTypes.STRING(24),
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING(24),
    allowNull: false,
    references: {
      model: "users",
      key: "nrp",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  asset_id: {
    type: DataTypes.STRING(24),
    allowNull: false,
    references: {
      model: "assets",
      key: "asset_number",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  loan_needs: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  loanAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  returnAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Transaction;
