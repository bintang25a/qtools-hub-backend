import { DataTypes } from "sequelize";
import { db } from "./Model.js";

const User = db.define("users", {
  nrp: {
    type: DataTypes.STRING(24),
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("planner", "tool keeper", "mechanic"),
    allowNull: false,
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
