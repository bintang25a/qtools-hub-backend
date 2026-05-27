import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const Assignment = db.define("assignments", {
  assignment_number: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true,
  },
  assistant_uid: {
    type: DataTypes.STRING(16),
    allowNull: false,
    references: {
      model: "users",
      key: "uid",
    },
    onUpdate: "CASCADE",
  },
  class_code: {
    type: DataTypes.STRING(32),
    allowNull: false,
    references: {
      model: "classrooms",
      key: "class_code",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  support_link: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  answer_key: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  overtime: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  startAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Assignment;
