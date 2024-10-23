import express, { Express, Request, Response } from "express";
//import 'reflect-metadata'
import { apiDataSource } from "./database";
import invRoute from "./routes/inventoryRoute";

const app = express();
const port = 3000;

async function startAPI() {
  try {
    await apiDataSource.initialize();
    console.log("Database initialized!");

    app.use(express.json());
    app.use("/api/inventory", invRoute);

    app.listen(port, () => console.log(`API Up on port ${port}`));
  } catch (e) {
    console.error("Error: ", e);
  }
}

startAPI();
