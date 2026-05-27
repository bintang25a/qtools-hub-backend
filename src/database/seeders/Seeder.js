import AssetSeeder from "./AssetSeeder.js";
import UserSeeder from "./UserSeeder.js";

const seeder = async () => {
  try {
    await UserSeeder();
    await AssetSeeder();

    console.log("Database seeding successfully");
  } catch (error) {
    console.error("Database seeding failed", error);
  }
};

seeder();
