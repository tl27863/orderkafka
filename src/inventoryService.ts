import { apiDataSource } from "./database";
import { Inventory } from "./entities";

export class InventoryService {
  private inventoryRepository = apiDataSource.getRepository(Inventory);

  async createOrUpdateInventory(
    productId: string,
    quantity: number,
  ): Promise<Inventory> {
    let inventory = await this.inventoryRepository.findOne({
      where: {
        product_id: productId,
      },
    });

    if (inventory) {
      inventory.quantity = inventory.quantity + quantity;
      inventory.updated_at = new Date();
    } else {
      inventory = this.inventoryRepository.create({
        product_id: productId,
        quantity: quantity,
        reserved_quantity: 0,
      });
    }

    return await this.inventoryRepository.save(inventory);
  }

  async getInventory(productId: string): Promise<Inventory | null> {
    return await this.inventoryRepository.findOne({
      where: { product_id: productId },
    });
  }

  async reserveInventory(
    productId: string,
    quantity: number,
  ): Promise<boolean> {
    const inventory = await this.getInventory(productId);
    if (
      !inventory ||
      inventory.quantity - inventory.reserved_quantity < quantity
    ) {
      return false;
    }

    inventory.reserved_quantity += quantity;
    await this.inventoryRepository.save(inventory);
    return true;
  }

  // async releaseReservedInventory(
  //   productId: string,
  //   quantity: number,
  // ): Promise<void> {
  //   const inventory = await this.getInventory(productId);
  //   if (inventory) {
  //     inventory.reserved_quantity = inventory.reserved_quantity - quantity;
  //     await this.inventoryRepository.save(inventory);
  //   }
  // }

  async commitInventory(productId: string, quantity: number): Promise<void> {
    const inventory = await this.getInventory(productId);
    if (inventory) {
      inventory.quantity -= quantity;
      inventory.reserved_quantity -= quantity;
      await this.inventoryRepository.save(inventory);
    }
  }
}
