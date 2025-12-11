import { sequelize } from "./config/db.js"; 
import "./models/index.js";

//sync all database models
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); //update tables without deleting data
    console.log("All models synced successfully!");
    console.log("Tables created:", Object.keys(sequelize.models));

    process.exit(0); 
  } catch (err) {
    console.error("Error syncing models:", err);
    process.exit(1); 
  }
};

syncModels();
