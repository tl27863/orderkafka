import { apiDataSource } from "../src/database";

export async function deleteAllData(): Promise<boolean> {
  try {
    await apiDataSource.query(`
      TRUNCATE TABLE payment_transaction, order_items, orders, inventory
      RESTART IDENTITY CASCADE;
    `);
    console.log("All data has been deleted successfully.");
    return true;
  } catch (error) {
    console.error("Error deleting data:", error);
    return false;
  }
}
