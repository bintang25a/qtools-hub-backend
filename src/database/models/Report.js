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
  evidence1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remark1: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  evidence2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remark2: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  follow_up: {
    type: DataTypes.ENUM("repair", "calibration", "replace"),
    allowNull: false,
    validate: {
      isIn: [["repair", "calibration", "replace"]],
    },
  },
  group_leader_id: {
    type: DataTypes.STRING(24),
    allowNull: true,
    references: {
      model: "users",
      key: "nrp",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  planner_id: {
    type: DataTypes.STRING(24),
    allowNull: true,
    references: {
      model: "users",
      key: "nrp",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  plant_engineer_id: {
    type: DataTypes.STRING(24),
    allowNull: true,
    references: {
      model: "users",
      key: "nrp",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  section_head_id: {
    type: DataTypes.STRING(24),
    allowNull: true,
    references: {
      model: "users",
      key: "nrp",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  dept_head_id: {
    type: DataTypes.STRING(24),
    allowNull: true,
    references: {
      model: "users",
      key: "nrp",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

export default Report;
