import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const AssistantClassroom = db.define("assistant_classroom", {
  uid: {
    type: DataTypes.STRING(16),
    allowNull: false,
    references: {
      model: "users",
      key: "uid",
    },
    onDelete: "CASCADE",
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
});

export default AssistantClassroom;
