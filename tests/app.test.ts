import request from "supertest";
import app, { initializeAPI } from "../src/app";
import { deleteAllData } from "./testService";
import { apiDataSource } from "../src/database";
import {
  INVENTORY_ONE,
  ORDERDATA_ONE,
  ORDERSTATUS,
  PAYMENTSTATUS,
  APISTATUS,
} from "./testData";

beforeAll(async () => {
  await initializeAPI();
});

afterAll(async () => {
  await apiDataSource.destroy();
});

describe("/api/inventory", () => {
  it("Input inventory to db and output it", async () => {
    await deleteAllData();

    const createInventory = await request(app)
      .post(
        `/api/inventory/update/${INVENTORY_ONE.PRODUCTID}/${INVENTORY_ONE.QUANTITY}`,
      )
      .set("Accept", "application/json");

    expect(createInventory.statusCode).toBe(APISTATUS.OK);

    const getInventory = await request(app)
      .get(`/api/inventory/stock?productId=${INVENTORY_ONE.PRODUCTID}`)
      .set("Accept", "application/json");

    expect(getInventory.statusCode).toBe(APISTATUS.OK);
    expect(getInventory.body.product_id).toBe(INVENTORY_ONE.PRODUCTID);
    expect(getInventory.body.quantity).toBe(INVENTORY_ONE.QUANTITY);
  });
  it("Reject non-integer quantity", async () => {
    await deleteAllData();

    const createNanInventory = await request(app)
      .post(`/api/inventory/update/${INVENTORY_ONE.PRODUCTID}/notanumber`)
      .set("Accept", "application/json");

    expect(createNanInventory.statusCode).toBe(APISTATUS.ERROR);

    const createDecimalInventory = await request(app)
      .post(`/api/inventory/update/${INVENTORY_ONE.PRODUCTID}/3.14`)
      .set("Accept", "application/json");

    expect(createDecimalInventory.statusCode).toBe(APISTATUS.ERROR);
  });
  it("Reject invalid uuid", async () => {
    await deleteAllData();

    const createUuidInventory = await request(app)
      .post(`/api/inventory/update/notauuid/37`)
      .set("Accept", "application/json");

    expect(createUuidInventory.statusCode).toBe(APISTATUS.ERROR);

    const getUuidInventory = await request(app)
      .get(`/api/inventory/stock?productId=notauuid`)
      .set("Accept", "application/json");

    expect(getUuidInventory.statusCode).toBe(APISTATUS.ERROR);
  });
});

describe("/api/order", () => {
  it("Input order to db and output it", async () => {
    await deleteAllData();

    await request(app)
      .post(
        `/api/inventory/update/${ORDERDATA_ONE.INVENTORY.product_id}/${ORDERDATA_ONE.INVENTORY.quantity}`,
      )
      .set("Accept", "application/json");

    const createOrder = await request(app)
      .post(`/api/order/create`)
      .set("Accept", "application/json")
      .send(ORDERDATA_ONE.ORDER);

    expect(createOrder.statusCode).toBe(APISTATUS.OK);

    const getOrder = await request(app)
      .get(`/api/order/${createOrder.body.orderId}`)
      .set("Accept", "application/json");

    expect(getOrder.statusCode).toBe(APISTATUS.OK);
    expect(Number(getOrder.body.amount)).toBe(ORDERDATA_ONE.AMOUNT);
    expect(getOrder.body.customer_id).toBe(ORDERDATA_ONE.ORDER.customer_id);
    expect(getOrder.body.status).toBe(ORDERSTATUS.PENDING);
    expect(getOrder.body.orderItems).toBeDefined();
    expect(Array.isArray(getOrder.body.orderItems)).toBeTruthy();
    expect(getOrder.body.orderItems.length).toBe(1);
    expect(getOrder.body.paymentTransaction.order_id).toBe(
      createOrder.body.orderId,
    );
    expect(Number(getOrder.body.paymentTransaction.amount)).toBe(
      ORDERDATA_ONE.AMOUNT,
    );
    expect(getOrder.body.paymentTransaction.status).toBe(
      PAYMENTSTATUS.AWAITINGPAYMENT,
    );

    const checkInventory = await request(app)
      .get(
        `/api/inventory/stock?productId=${ORDERDATA_ONE.INVENTORY.product_id}`,
      )
      .set("Accept", "application/json");

    expect(checkInventory.status).toBe(APISTATUS.OK);
    expect(checkInventory.body.quantity).toBe(ORDERDATA_ONE.INVENTORY.quantity);
    expect(checkInventory.body.reserved_quantity).toBe(
      ORDERDATA_ONE.ORDER.items[0].quantity,
    );
  });
  it("Confirm Order", async () => {
    const updateOrderStatus = await request(app)
      .put(`/api/order/1?status=${ORDERSTATUS.CONFIRMED}`)
      .set("Accept", "application/json");

    expect(updateOrderStatus.status).toBe(APISTATUS.OK);

    const getOrder = await request(app)
      .get(`/api/order/1`)
      .set("Accept", "application/json");

    expect(getOrder.status).toBe(APISTATUS.OK);
    expect(getOrder.body.status).toBe(ORDERSTATUS.CONFIRMED);
    expect(getOrder.body.paymentTransaction.status).toBe(PAYMENTSTATUS.PAID);

    const checkInventory = await request(app)
      .get(
        `/api/inventory/stock?productId=${ORDERDATA_ONE.INVENTORY.product_id}`,
      )
      .set("Accept", "application/json");

    expect(checkInventory.status).toBe(APISTATUS.OK);
    expect(checkInventory.body.quantity).toBe(
      ORDERDATA_ONE.INVENTORY.quantity - ORDERDATA_ONE.ORDER.items[0].quantity,
    );
    expect(checkInventory.body.reserved_quantity).toBe(0);
  });
  it("Cancel Order", async () => {
    await deleteAllData();

    await request(app)
      .post(
        `/api/inventory/update/${ORDERDATA_ONE.INVENTORY.product_id}/${ORDERDATA_ONE.INVENTORY.quantity}`,
      )
      .set("Accept", "application/json");

    const createOrder = await request(app)
      .post(`/api/order/create`)
      .set("Accept", "application/json")
      .send(ORDERDATA_ONE.ORDER);

    expect(createOrder.statusCode).toBe(APISTATUS.OK);

    const updateOrderStatus = await request(app)
      .put(`/api/order/1?status=${ORDERSTATUS.CANCELLED}`)
      .set("Accept", "application/json");

    expect(updateOrderStatus.status).toBe(APISTATUS.OK);

    const getOrder = await request(app)
      .get(`/api/order/1`)
      .set("Accept", "application/json");

    expect(getOrder.status).toBe(APISTATUS.OK);
    expect(getOrder.body.status).toBe(ORDERSTATUS.CANCELLED);
    expect(getOrder.body.paymentTransaction.status).toBe(
      PAYMENTSTATUS.CANCELLED,
    );

    const checkInventory = await request(app)
      .get(
        `/api/inventory/stock?productId=${ORDERDATA_ONE.INVENTORY.product_id}`,
      )
      .set("Accept", "application/json");

    expect(checkInventory.status).toBe(APISTATUS.OK);
    expect(checkInventory.body.quantity).toBe(ORDERDATA_ONE.INVENTORY.quantity);
    expect(checkInventory.body.reserved_quantity).toBe(0);
  });
});
