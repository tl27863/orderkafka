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

describe("POST & GET /api/inventory", () => {
  it("Successfuly input data to db and output it", async () => {
    await deleteAllData();

    const uuid = crypto.randomUUID();
    const postRes = await request(app)
      .post(`/api/inventory/update/${uuid}/1`)
      .set("Accept", "application/json");

    const getRes = await request(app)
      .get(`/api/inventory/stock?productId=${uuid}`)
      .set("Accept", "application/json");

    expect(postRes.statusCode).toBe(200);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.product_id).toBe(uuid);
    expect(getRes.body.quantity).toBe(1);
  });
  it("Successfuly response to invalid data", async () => {
    await deleteAllData();

    const uuid = crypto.randomUUID();
    const postNanRes = await request(app)
      .post(`/api/inventory/update/${uuid}/notanumber`)
      .set("Accept", "application/json");

    const postDecimalRes = await request(app)
      .post(`/api/inventory/update/${uuid}/3.14`)
      .set("Accept", "application/json");

    const postUUIDRes = await request(app)
      .post(`/api/inventory/update/notauuid/37`)
      .set("Accept", "application/json");

    const getUUIDRes = await request(app)
      .get(`/api/inventory/stock?productId=notauuid`)
      .set("Accept", "application/json");

    expect(postNanRes.statusCode).toBe(400);
    expect(postDecimalRes.statusCode).toBe(400);
    expect(postUUIDRes.statusCode).toBe(400);
    expect(getUUIDRes.statusCode).toBe(400);
  });
});
