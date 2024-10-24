import { apiDataSource } from "../database";
import { Order, OrderItem } from "../entities";
import { InventoryService } from "./inventoryService";
import { PaymentService } from "./paymentService";

interface CreateOrderItemDTO {
  product_id: string;
  quantity: number;
  price: number;
}

interface CreateOrderDTO {
  customer_id: string;
  items: CreateOrderItemDTO[];
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class OrderService {
  private orderRepository = apiDataSource.getRepository(Order);
  private orderItemRepository = apiDataSource.getRepository(OrderItem);
  private inventoryService: InventoryService;
  private paymentService: PaymentService;

  async createOrder(orderData: CreateOrderDTO): Promise<ServiceResponse<void>> {
    try {
      const queryRunner = apiDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // 1. Check and reserve inventory for all items
        for (const item of orderData.items) {
          const reserveResult = await this.inventoryService.reserveInventory(
            item.product_id,
            item.quantity,
          );

          if (!reserveResult.success) {
            throw new Error(
              `Insufficient inventory for product ${item.product_id}`,
            );
          }
        }

        // 2. Calculate total amount
        const totalAmount = orderData.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0,
        );

        // 3. Create order
        const order = this.orderRepository.create({
          customer_id: orderData.customer_id,
          status: "PENDING",
          amount: totalAmount,
          orderItems: [],
        });

        const savedOrder = await this.orderRepository.save(order);

        // 4. Create order items
        const orderItems = orderData.items.map((item) =>
          this.orderItemRepository.create({
            order_id: savedOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          }),
        );

        await this.orderItemRepository.save(orderItems);

        //5. Create transaction
        await this.paymentService.createTransaction(savedOrder.id);

        await queryRunner.commitTransaction();
        return {
          success: true,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create order",
      };
    }
  }

  async getOrder(orderId: number): Promise<ServiceResponse<Order>> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ["orderItems", "paymentTransactions"],
      });

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      return {
        success: true,
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get order",
      };
    }
  }

  async updateOrderStatus(
    orderId: number,
    status: string,
  ): Promise<ServiceResponse<Order>> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ["orderItems"],
      });

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      order.status = status;

      // If order is confirmed, commit the inventory
      if (status === "CONFIRMED") {
        for (const item of order.orderItems) {
          await this.inventoryService.commitInventory(
            item.product_id,
            item.quantity,
          );
        }
      }

      // Save the updated order
      const updatedOrder = await this.orderRepository.save(order);

      return {
        success: true,
        data: updatedOrder,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
      };
    }
  }

  async cancelOrder(orderId: number): Promise<ServiceResponse<void>> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ["orderItems"],
      });

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      if (order.status === "CONFIRMED") {
        return {
          success: false,
          error: "Cannot cancel confirmed order",
        };
      }

      for (const item of order.orderItems) {
        await this.inventoryService.releaseReservedInventory(
          item.product_id,
          item.quantity,
        );
      }

      order.status = "CANCELLED";
      await this.orderRepository.save(order);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to cancel order",
      };
    }
  }
}
