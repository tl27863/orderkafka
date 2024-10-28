import express, { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { validate as uuidValidate } from "uuid";

const orderService = new OrderService();
const router = express.Router();

function validateUUID(uuid: string): boolean {
  return uuidValidate(uuid);
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

router.post("/create", async (req: Request, res: Response) => {
  const orderData = req.body;

  try {
    if (
      !orderData.customer_id ||
      !validateUUID(orderData.customer_id) ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      throw new Error(
        "Invalid order data. Must include customer_id and at least one item",
      );
    }

    const validItems = orderData.items.every(
      (item: OrderItem) =>
        item.product_id &&
        typeof item.quantity === "number" &&
        item.quantity > 0 &&
        typeof item.price === "number" &&
        item.price >= 0,
    );

    if (!validItems) {
      throw new Error(
        "Invalid item data. Each item must have product_id, quantity, and price",
      );
    }

    const result = await orderService.createOrder(orderData);
    if (result.success) {
      res
        .status(200)
        .json({ orderId: result.data, message: "Order created successfully" });
    } else {
      throw new Error("Failed to create order");
    }
  } catch (error) {
    res.status(400).send({
      message:
        error instanceof Error ? error.message : "Failed to create order",
    });
  }
});

router.get("/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const id = Number(orderId);

  if (isNaN(id) || !Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid order Id" });
  } else {
    const result = await orderService.getOrder(id);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ message: result.error });
    }
  }
});

router.put("/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.query;
  const id = Number(orderId);

  try {
    if (isNaN(id) || !Number.isInteger(id)) {
      throw new Error("Invalid order ID");
    }

    const allowedStatuses = ["CONFIRMED", "CANCELLED"];
    if (
      !status ||
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      throw new Error("Invalid status");
    }

    if (status === "CONFIRMED") {
      const result = await orderService.updateOrderStatus(id, status);
      if (result.success) {
        res.status(200).json(result.data);
      } else {
        throw new Error(result.error);
      }
    } else {
      const result = await orderService.cancelOrder(id);
      if (result.success) {
        res.status(200).json(result.data);
      } else {
        throw new Error(result.error);
      }
    }
  } catch (error) {
    res.status(400).send({
      message:
        error instanceof Error ? error.message : "Failed to update status",
    });
  }
});

export default router;
