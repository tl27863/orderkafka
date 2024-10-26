import crypto from "crypto";

const customerIdOne = crypto.randomUUID();
const productIdOne = crypto.randomUUID();

export const INVENTORY_ONE = {
  PRODUCTID: productIdOne,
  QUANTITY: 5,
};

export const ORDERDATA_ONE = {
  INVENTORY: {
    product_id: productIdOne,
    quantity: 5,
  },
  ORDER: {
    customer_id: customerIdOne,
    items: [
      {
        product_id: productIdOne,
        quantity: 4,
        price: 11,
      },
    ],
  },
  AMOUNT: 44.0,
};

export const ORDERSTATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
};

export const PAYMENTSTATUS = {
  AWAITINGPAYMENT: "AWAITING PAYMENT",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
};

export const APISTATUS = {
  OK: 200,
  NOTFOUND: 404,
  ERROR: 400,
};
