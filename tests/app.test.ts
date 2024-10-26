import request from "supertest";
import app, { initializeAPI } from "../src/app";
import crypto from "crypto";
import { deleteAllData } from "./testService";
import { apiDataSource } from "../src/database";

beforeAll(async () => {
  await initializeAPI();
});

afterAll(async () => {
  await apiDataSource.destroy();
});

describe("/api/inventory", () => {
  it("Input inventory to db and output it", async () => {
    await deleteAllData();

    const uuid = crypto.randomUUID();
    const createInventory = await request(app)
      .post(`/api/inventory/update/${uuid}/1`)
      .set("Accept", "application/json");

    expect(createInventory.statusCode).toBe(200);

    const getInventory = await request(app)
      .get(`/api/inventory/stock?productId=${uuid}`)
      .set("Accept", "application/json");

    expect(getInventory.statusCode).toBe(200);
    expect(getInventory.body.product_id).toBe(uuid);
    expect(getInventory.body.quantity).toBe(1);
  });
  it("Reject non-integer quantity", async () => {
    await deleteAllData();

    const uuid = crypto.randomUUID();
    const createNanInventory = await request(app)
      .post(`/api/inventory/update/${uuid}/notanumber`)
      .set("Accept", "application/json");

    expect(createNanInventory.statusCode).toBe(400);

    const createDecimalInventory = await request(app)
      .post(`/api/inventory/update/${uuid}/3.14`)
      .set("Accept", "application/json");

    expect(createDecimalInventory.statusCode).toBe(400);
  });
  it("Reject invalid uuid", async () => {
    await deleteAllData();

    const createUuidInventory = await request(app)
      .post(`/api/inventory/update/notauuid/37`)
      .set("Accept", "application/json");

    expect(createUuidInventory.statusCode).toBe(400);

    const getUuidInventory = await request(app)
      .get(`/api/inventory/stock?productId=notauuid`)
      .set("Accept", "application/json");

    expect(getUuidInventory.statusCode).toBe(400);
  });
});

describe("/api/order", () => {
  it("Input order to db and output it", async () => {
    await deleteAllData();

    const customerUuid = crypto.randomUUID();
    const productUuid = crypto.randomUUID();
    const itemsPrice = 11;
    const itemsQuantity = 4;
    const order = {
      customer_id: customerUuid,
      items: [
        {
          product_id: productUuid,
          quantity: itemsQuantity,
          price: itemsPrice,
        },
      ],
    };

    await request(app)
      .post(`/api/inventory/update/${productUuid}/5`)
      .set("Accept", "application/json");

    const createOrder = await request(app)
      .post(`/api/order/create`)
      .set("Accept", "application/json")
      .send(order);

    expect(createOrder.statusCode).toBe(200);

    const getOrder = await request(app)
      .get(`/api/order/${createOrder.body.orderId}`)
      .set("Accept", "application/json");

    expect(getOrder.statusCode).toBe(200);
    expect(Number(getOrder.body.amount)).toBe(itemsPrice * itemsQuantity);
    expect(getOrder.body.customer_id).toBe(customerUuid);
    expect(getOrder.body.status).toBe("PENDING");
    expect(getOrder.body.orderItems).toBeDefined();
    expect(Array.isArray(getOrder.body.orderItems)).toBeTruthy();
    expect(getOrder.body.orderItems.length).toBe(1);
    expect(getOrder.body.paymentTransaction.order_id).toBe(
      createOrder.body.orderId,
    );
    expect(Number(getOrder.body.paymentTransaction.amount)).toBe(
      itemsPrice * itemsQuantity,
    );
    expect(getOrder.body.paymentTransaction.status).toBe("AWAITING PAYMENT");

    const checkInventory = await request(app)
      .get(`/api/inventory/stock?productId=${productUuid}`)
      .set("Accept", "application/json");

    expect(checkInventory.status).toBe(200);
    expect(checkInventory.body.quantity).toBe(5);
    expect(checkInventory.body.reserved_quantity).toBe(4);
  });
});
