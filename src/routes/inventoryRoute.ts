import express, { Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";

const inventoryService = new InventoryService();
const router = express.Router();

router.post(
  "/update/:productId/:quantity",
  async (req: Request, res: Response) => {
    const { productId, quantity } = req.params;
    const qty = parseInt(quantity, 10);

    if (isNaN(qty)) {
      res
        .status(400)
        .send({ message: "Invalid quantity. Please provide a valid integer." });
    }

    if (!Number.isInteger(qty)) {
      res.status(400).send({ message: "Quantity must be a whole number." });
    }

    await inventoryService.createOrUpdateInventory(productId, qty);
    res.status(200).send({ message: "Inventory updated" });
  },
);

router.get("/stock", async (req: Request, res: Response) => {
  const { productId } = req.query;
  if (typeof productId !== "string" || !productId) {
    res.status(400).send({ message: "Invalid Id" });
  } else {
    const result = await inventoryService.getInventory(productId);
    if (result.success) {
      res.status(200).send(result.data);
    } else {
      res.status(200).send({ message: "No data" });
    }
  }
});

export default router;
