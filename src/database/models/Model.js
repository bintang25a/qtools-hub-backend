import db from "../../config/database.js";
import User from "./User.js";
import Transaction from "./Transaction.js";
import Asset from "./Asset.js";
import Repair from "./Repair.js";
import Report from "./Report.js";
import { DataTypes } from "sequelize";

User.hasMany(Transaction, {
  foreignKey: "user_id",
  sourceKey: "nrp",
  as: "transactions",
});
User.hasMany(Report, {
  foreignKey: "reporter_id",
  sourceKey: "nrp",
  as: "reports",
});

Asset.hasMany(Transaction, {
  foreignKey: "asset_id",
  sourceKey: "asset_number",
  as: "transactions",
});
Asset.hasMany(Repair, {
  foreignKey: "asset_id",
  sourceKey: "asset_number",
  as: "repairs",
});
Asset.hasMany(Report, {
  foreignKey: "asset_id",
  sourceKey: "asset_number",
  as: "reports",
});

Transaction.belongsTo(User, {
  foreignKey: "user_id",
  sourceKey: "nrp",
  as: "user",
});
Transaction.belongsTo(Asset, {
  foreignKey: "asset_id",
  sourceKey: "asset_number",
  as: "asset",
});

Repair.belongsTo(Asset, {
  foreignKey: "asset_id",
  sourceKey: "asset_number",
  as: "asset",
});

Report.belongsTo(Asset, {
  foreignKey: "asset_id",
  sourceKey: "asset_number",
  as: "asset",
});

const userRelations = [
  { foreignKey: "reporter_id", as: "reporter" },
  { foreignKey: "group_leader_id", as: "groupLeader" },
  { foreignKey: "planner_id", as: "planner" },
  { foreignKey: "plant_engineer_id", as: "plantEngineer" },
  { foreignKey: "section_head_id", as: "sectionHead" },
  { foreignKey: "dept_head_id", as: "deptHead" },
];

userRelations.forEach(({ foreignKey, as }) => {
  Report.belongsTo(User, {
    foreignKey,
    targetKey: "nrp",
    as,
  });
});

const Setting = db.define("settings", {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

const Token = db.define("tokens", {
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export { db, User, Asset, Transaction, Repair, Report, Token, Setting };
