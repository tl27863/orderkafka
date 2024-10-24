import { apiDataSource } from "../database";
import { Order, PaymentTransaction } from "../entities";
import crypto from "crypto";

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class PaymentService {
  private paymentRepository = apiDataSource.getRepository(PaymentTransaction);
  private orderRepository = apiDataSource.getRepository(Order);

  async createTransaction(orderId: number): Promise<ServiceResponse<void>> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      const newTransaction = this.paymentRepository.create({
        order_id: order.id,
        amount: order.amount,
        status: "AWAITING PAYMENT",
        transaction_id: crypto.randomUUID(),
      });

      await this.paymentRepository.save(newTransaction);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create transaction",
      };
    }
  }
}
