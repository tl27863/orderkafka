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

      if (!order) throw new Error("Order not found");

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

  async updatePaymentStatus(
    transactionId: string,
    status: string,
  ): Promise<ServiceResponse<void>> {
    try {
      let payment = await this.paymentRepository.findOne({
        where: { transaction_id: transactionId },
      });

      if (!payment) throw new Error("Transaction not found");

      const allowedStatuses = ["PAID", "CANCELLED"];
      if (!status || !allowedStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      if (allowedStatuses.includes(payment.status)) {
        throw new Error("Status cant be changed at this stage");
      }

      payment.status = status;
      await this.paymentRepository.save(payment);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update transaction status",
      };
    }
  }
}
