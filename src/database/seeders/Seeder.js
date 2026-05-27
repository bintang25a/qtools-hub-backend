const seeder = async () => {
  try {
    await UserSeeder();

    console.log("Database seeding successfully");
  } catch (error) {
    console.error("Database seeding failed", error);
  }
};

seeder();
