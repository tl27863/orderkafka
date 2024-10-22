import express, { Express, Request, Response } from "express";
import { Pool } from "pg";

const app: Express = express();
const port = 3000;

app.use(express.json());

app.post("api/inventory", (req: Request, res: Response) => {
  const newInventory = req.body;

  //save or update postgress database
});

app.post("api/orders", (req: Request, res: Response) => {
  const newOrder = req.body;

  //save or update postgress database
});

app.get("api/inventory", (req: Request, res: Response) => {
  //get data from db
  res.status(200);
});

app.get("api/orders", (req: Request, res: Response) => {
  //get data from db
  res.status(200);
});

app.listen(port, () => console.log(`API Up on port ${port}`));
