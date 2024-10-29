import express from "express";
import { apiDataSource } from "./database";
import invRoute from "./routes/inventoryRoute";
import orderRoute from "./routes/orderRoute";
import { KafkaService } from "./kafka";

const app = express();

export async function initializeAPI() {
  const kafkaService = new KafkaService();

  try {
    await kafkaService.connect();
    await apiDataSource.initialize();
    console.log("Database initialized!");

    app.use(express.json());
    app.use("/api/inventory", invRoute);
    app.use("/api/order", orderRoute);

    process.on("SIGINT", async () => {
      await apiDataSource.destroy();
      await kafkaService.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default app;
