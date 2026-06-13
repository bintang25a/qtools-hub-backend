import {
  db,
  User,
  Asset,
  Transaction,
  Repair,
  Report,
  Tool,
  Inspection,
  ToolInspection,
} from "../models/Model.js";

const migration = async () => {
  const args = process.argv.slice(2);
  const tableArg = args.find((arg) => arg.startsWith("--table="));
  const tableName = tableArg ? tableArg.split("=")[1] : null;

  const models = {
    users: User,
    assets: Asset,
    transactions: Transaction,
    repairs: Repair,
    reports: Report,
    tools: Tool,
    inspections: Inspection,
    tool_inspection: ToolInspection,
  };

  try {
    await db.query("SET FOREIGN_KEY_CHECKS = 0");

    if (tableName && models[tableName]) {
      console.log(`Migrating ONLY table: ${tableName}...`);
      await models[tableName].sync({ force: true });
    } else if (tableName && !models[tableName]) {
      console.error(`Table "${tableName}" not found in migration list!`);
      process.exit(1);
    } else {
      console.log("Migrating ALL tables...");
      await db.sync({ force: true });
    }

    console.log("Migration process finished successfully");
  } catch (error) {
    console.error("igration failed:", error);
  } finally {
    process.exit();
  }
};

migration();
