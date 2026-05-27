import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const Asset = db.define("assets", {
  asset_number: {
    type: DataTypes.STRING(24),
    allowNull: false,
    primaryKey: true,
  },
  class: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  creator: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Asset;
