import {
  db,
  User,
  Classroom,
  Material,
  Assignment,
  Testcase,
  Submission,
} from "../models/Model.js";

const migration = async () => {
  const args = process.argv.slice(2);
  const tableArg = args.find((arg) => arg.startsWith("--table="));
  const tableName = tableArg ? tableArg.split("=")[1] : null;

  const models = {
    users: User,
    classrooms: Classroom,
    materials: Material,
    assignments: Assignment,
    testcases: Testcase,
    submissions: Submission,
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
