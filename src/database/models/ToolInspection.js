import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const ToolInspection = db.define("tools_inspections", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tool_number: {
    type: DataTypes.STRING(24),
    allowNull: false,
    references: {
      model: "tools",
      key: "tool_number",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  Inspection_id: {
    type: DataTypes.STRING(24),
    allowNull: false,
    references: {
      model: "inspections",
      key: "inspection_id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  condition: {
    type: DataTypes.ENUM("good", "broken", "missing"),
    allowNull: false,
  },
});

export default ToolInspection;
