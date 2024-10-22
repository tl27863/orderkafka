import express, { Express, Request, Response } from "express";
//import 'reflect-metadata'
import { apiDataSource } from "./database";

const app: Express = express();
const port = 3000;

async function startAPI() {
  try {
    await apiDataSource.initialize();
    console.log("Database initialized!");

    app.use(express.json());

    app.listen(port, () => console.log(`API Up on port ${port}`));
  } catch (e) {
    console.error("Error: ", e);
  }
}

startAPI();
