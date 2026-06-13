import AssetSeeder from "./AssetSeeder.js";
import ToolSeeder from "./ToolSeeder.js";
import UserSeeder from "./UserSeeder.js";

const seeder = async () => {
  try {
    await UserSeeder();
    await AssetSeeder();
    await ToolSeeder();

    console.log("Database seeding successfully");
  } catch (error) {
    console.error("Database seeding failed", error);
  }
};

seeder();
