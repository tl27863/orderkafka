import express from "express";
import { apiDataSource } from "./database";
import invRoute from "./routes/inventoryRoute";
import orderRoute from "./routes/orderRoute";

const app = express();

export async function initializeAPI() {
  await apiDataSource.initialize();
  console.log("Database initialized!");

  app.use(express.json());
  app.use("/api/inventory", invRoute);
  app.use("/api/order", orderRoute);
}

export default app;
