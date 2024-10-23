import express, { Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";
import { validate as uuidValidate } from "uuid";

const inventoryService = new InventoryService();
const router = express.Router();

function validateUUID(uuid: string): boolean {
  return uuidValidate(uuid);
}

router.post(
  "/update/:productId/:quantity",
  async (req: Request, res: Response) => {
    const { productId, quantity } = req.params;
    const qty = Number(quantity);

    if (!validateUUID(productId) || isNaN(qty) || !Number.isInteger(qty)) {
      res.status(400).send({ message: "Invalid input" });
    } else {
      await inventoryService.createOrUpdateInventory(productId, qty);
      res.status(200).send({ message: "Inventory updated" });
    }
  },
);

router.get("/stock", async (req: Request, res: Response) => {
  const { productId } = req.query;
  if (typeof productId !== "string" || !productId || !validateUUID(productId)) {
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
