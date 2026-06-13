import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const Inspection = db.define("inspections", {
  Inspection_id: {
    type: DataTypes.STRING(24),
    allowNull: false,
    primaryKey: true,
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
  inspectionAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Inspection;
