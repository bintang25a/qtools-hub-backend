import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const Repair = db.define("repairs", {
  repair_id: {
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
  repairAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  finishAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Repair;
