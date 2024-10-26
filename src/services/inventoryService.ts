import { apiDataSource } from "../database";
import { Inventory } from "../entities";

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class InventoryService {
  private inventoryRepository = apiDataSource.getRepository(Inventory);

  async createOrUpdateInventory(
    productId: string,
    quantity: number,
  ): Promise<ServiceResponse<void>> {
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

    await this.inventoryRepository.save(inventory);
    return { success: true };
  }

  async getInventory(productId: string): Promise<ServiceResponse<Inventory>> {
    const res = await this.inventoryRepository.findOne({
      where: { product_id: productId },
    });

    if (res == null) return { success: false };
    return { success: true, data: res };
  }

  async reserveInventory(
    productId: string,
    quantity: number,
  ): Promise<ServiceResponse<void>> {
    const inventory = await this.getInventory(productId);
    if (
      !inventory.success ||
      inventory.data!.quantity - inventory.data!.reserved_quantity < quantity
    ) {
      return { success: false };
    }

    inventory.data!.reserved_quantity += quantity;
    await this.inventoryRepository.save(inventory.data!);
    return { success: true };
  }

  async releaseReservedInventory(
    productId: string,
    quantity: number,
  ): Promise<ServiceResponse<void>> {
    const inventory = await this.getInventory(productId);
    if (inventory) {
      inventory.data!.reserved_quantity -= quantity;
      await this.inventoryRepository.save(inventory.data!);
      return { success: true };
    } else {
      return { success: false };
    }
  }

  async commitInventory(
    productId: string,
    quantity: number,
  ): Promise<ServiceResponse<void>> {
    const inventory = await this.getInventory(productId);
    if (inventory.success) {
      inventory.data!.quantity -= quantity;
      inventory.data!.reserved_quantity -= quantity;
      await this.inventoryRepository.save(inventory.data!);

      return { success: true };
    }

    return { success: false };
  }
}
