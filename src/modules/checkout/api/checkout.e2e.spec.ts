import { Umzug } from "umzug";
import { migrator } from "../../../migrations/config-migrations/migrator";
import InvoiceItemsModel from "../../invoice/repository/invoice-items.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import TransactionModel from "../../payment/repository/transaction.model";
import { ClientModel as CheckoutClientModel } from "../repository/client.model";
import OrderModel from "../repository/order.model";

import { Sequelize } from "sequelize-typescript";
import { ProductModel as ProductAdmProductModel } from "../../product-adm/repository/product.model";
import { ProductModel as CheckoutProductModel } from "../repository/product.model";
import ProductModel from "../../store-catalog/repository/product.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import { app } from "../../../api/express";
import request from "supertest";

describe("e2e checkout tests", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      OrderModel,
      CheckoutClientModel,
      CheckoutProductModel,
      ClientModel,
      ProductAdmProductModel,
      ProductModel,
      InvoiceModel,
      InvoiceItemsModel,
      TransactionModel,
    ]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should throw an error when client not found", async () => {
    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      });

    expect(response.status).toBe(400);
  });

  it("should throw an error when product not found", async () => {
    await ClientModel.create({
      id: "1c",
      name: "client 1",
      email: "client@user.com",
      document: "0000",
      city: "city",
      complement: "",
      number: "0",
      state: "RJ",
      street: "street",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
    .post("/checkout")
    .send({
      clientId: "1c",
      products: [{ productId: "1" }, { productId: "2" }],
    });

    expect(response.status).toBe(400);
  });

  it("should throw an error when product not selected", async () => {
    await ClientModel.create({
      id: "1c",
      name: "client 1",
      email: "client@user.com",
      document: "0000",
      city: "city",
      complement: "",
      number: "0",
      state: "RJ",
      street: "street",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
    .post("/checkout")
    .send({
      clientId: "1c",
      products: [],
    });

    expect(response.status).toBe(400);
  });
  it("should throw an error when product is out of stock", async () => {
    await ClientModel.create({
      id: "1c",
      name: "client 1",
      email: "client@user.com",
      document: "0000",
      city: "city",
      complement: "",
      number: "0",
      state: "RJ",
      street: "street",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductAdmProductModel.create({
      id: "1",
      name: "product 1",
      description: "product 1 description",
      purchasePrice: 100,
      stock: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
    .post("/checkout")
    .send({
      clientId: "1c",
      products: [{ productId: "1" }],
    });

    expect(response.status).toBe(400);
  });

  it("should place an order with invoice", async () => {
    await ClientModel.create({
      id: "1c",
      name: "client 1",
      email: "client@user.com",
      document: "0000",
      city: "city",
      complement: "",
      number: "0",
      state: "RJ",
      street: "street",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await CheckoutProductModel.create({
        id: "1",
        name: "product 1",
        description: "product 1 description",
        salesPrice: 100,
        orderId: null,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.log(error);
    }

    const response = await request(app)
    .post("/checkout")
    .send({
      clientId: "1c",
      products: [{ productId: "1" }],
    });

    expect(response.status).toBe(200);

    const respondeBody = response.body;
    expect(respondeBody.status).toBe("approved");
    expect(respondeBody.total).toEqual(100);
    expect(respondeBody.id).toBeDefined();
    expect(respondeBody.invoiceId).toBeDefined();
    expect(respondeBody.products[0].productId).toEqual('1');
  });
});
