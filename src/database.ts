import { DataSource } from "typeorm";
import { Order, OrderItem, Inventory, PaymentTransaction } from "./entities";
import config from "./config";

export const apiDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: 5432,
  username: config.database.username,
  password: config.database.password,
  database: config.database.dbname,
  synchronize: false,
  logging: true,
  entities: [Order, OrderItem, Inventory, PaymentTransaction],
  ssl: {
    rejectUnauthorized: false,
  },
});
