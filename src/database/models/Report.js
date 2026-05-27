import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const Report = db.define("reports", {
  report_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  reporter_id: {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Report;
