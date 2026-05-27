import db from "../../config/database.js";
import User from "./User.js";
import Transaction from "./Transaction.js";
import Asset from "./Asset.js";
import Repair from "./Repair.js";
import Report from "./Report.js";
import { DataTypes } from "sequelize";

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

Report.belongsTo(User, {
  foreignKey: "reporter_id",
  sourceKey: "nrp",
  as: "reporter",
});
Report.belongsTo(Asset, {
  foreignKey: "asset_id",
  sourceKey: "asset_number",
  as: "asset",
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
