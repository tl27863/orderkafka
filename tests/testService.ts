import { apiDataSource } from "../src/database";
import {
  Order,
  OrderItem,
  Inventory,
  PaymentTransaction,
} from "../src/entities";

export async function deleteAllData(): Promise<boolean> {
  try {
    // Start a transaction
    await apiDataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(PaymentTransaction, {});
      await transactionalEntityManager.delete(OrderItem, {});
      await transactionalEntityManager.delete(Order, {});
      await transactionalEntityManager.delete(Inventory, {});

      console.log("All data has been deleted successfully.");
    });

    return true;
  } catch (error) {
    console.error("Error deleting data:", error);
    return false;
  }
}
