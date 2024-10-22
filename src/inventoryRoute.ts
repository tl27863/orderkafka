import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.post("api/inventory", (req: Request, res: Response) => {
  const newInventory = req.body;

  //save or update postgress database
});

router.get("api/inventory", (req: Request, res: Response) => {
  //get data from db
  res.status(200);
});

export default router;
