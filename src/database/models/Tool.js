import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const Tool = db.define("tools", {
  tool_number: {
    type: DataTypes.STRING(24),
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stock_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Tool;
