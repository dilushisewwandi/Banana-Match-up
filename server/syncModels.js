import { sequelize } from "./config/db.js"; 
import "./models/index.js";

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // drop & recreate tables
    console.log("All models synced successfully!");
    console.log("Tables created:", Object.keys(sequelize.models));

    process.exit(0); 
  } catch (err) {
    console.error("Error syncing models:", err);
    process.exit(1); 
  }
};

syncModels();
