import { Sequelize } from "sequelize-typescript";
import { ClientModel as CheckoutClientModel } from "../repository/client.model";
import OrderModel from "../repository/order.model";
import { ProductModel as CheckoutProductModel } from "../repository/product.model";
import CheckoutFacadeFactory from "../factory/checkout.factory";
import { PlaceOrderFacadeInputDto } from "./checkout.facade.dto";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductModel as ProductAdmProductModel } from "../../product-adm/repository/product.model";
import ProductModel from "../../store-catalog/repository/product.model";
import { Umzug } from "umzug";
import { migrator } from "../../../migrations/config-migrations/migrator";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemsModel from "../../invoice/repository/invoice-items.model";
import TransactionModel from "../../payment/repository/transaction.model";

describe("checkout facade test", () => {
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
    const facade = CheckoutFacadeFactory.create();

    const input: PlaceOrderFacadeInputDto = {
      clientId: "1c",
      products: [{ productId: "1" }, { productId: "2" }],
    };

    await expect(facade.addOrder(input)).rejects.toThrow(
      new Error("Client not found")
    );
  });

  it("should throw an error when product not found", async () => {
    const facade = CheckoutFacadeFactory.create();

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

    const input: PlaceOrderFacadeInputDto = {
      clientId: "1c",
      products: [{ productId: "1" }, { productId: "2" }],
    };

    await expect(facade.addOrder(input)).rejects.toThrow(
      new Error("Product with Id 1 not found")
    );
  });

  it("should throw an error when product not selected", async () => {
    const facade = CheckoutFacadeFactory.create();

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

    const input: PlaceOrderFacadeInputDto = {
      clientId: "1c",
      products: [],
    };

    await expect(facade.addOrder(input)).rejects.toThrow(
      new Error("No products selected")
    );
  });
  it("should throw an error when product is out of stock", async () => {
    const facade = CheckoutFacadeFactory.create();

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

    const input: PlaceOrderFacadeInputDto = {
      clientId: "1c",
      products: [{ productId: "1" }],
    };

    await expect(facade.addOrder(input)).rejects.toThrow(
      new Error("Product 1 is not available in stock")
    );
  });

  it("should place an order with invoice", async () => {
    const facade = CheckoutFacadeFactory.create();

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

    const input: PlaceOrderFacadeInputDto = {
      clientId: "1c",
      products: [{ productId: "1" }],
    };

    const output = await facade.addOrder(input);

    expect(output.status).toBe("approved");
    expect(output.total).toEqual(100);
    expect(output.id).toBeDefined();
    expect(output.invoiceId).toBeDefined();
    expect(output.products[0].productId).toEqual(input.products[0].productId);
  });
});
