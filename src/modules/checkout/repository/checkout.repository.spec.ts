import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ProductModel from "./product.model";
import OrderModel from "./order.model";
import CheckoutRepository from "./checkout.repository";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";

describe("checkout repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([OrderModel, ClientModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add an order", async () => {
    const checkoutRepository = new CheckoutRepository();

    const input = new Order({
      id: new Id("1"),
      status: "approved",
      client: new Client({
        id: new Id("1c"),
        name: "client 0",
        document: "0000",
        email: "client@user.com",
        street: "some address",
        number: "1",
        complement: "",
        city: "some city",
        state: "RJ",
        zipCode: "000",
      }),
      products: [
        new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "description",
          salesPrice: 40,
        }),
        new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "description",
          salesPrice: 30,
        }),
      ],
    });

    await checkoutRepository.addOrder(input);

    const result = await OrderModel.findOne({
      where: { id: input.id.id },
      include: ["products"],
    });

    expect(result.dataValues.id).toEqual(input.id.id);
    expect(result.dataValues.clientId).toEqual(input.client.id.id);
    expect(result.dataValues.status).toEqual(input.status);
    expect(result.dataValues.createdAt).toBeDefined();
    expect(result.dataValues.updatedAt).toBeDefined();

    expect(result.dataValues.products).toHaveLength(2);
    expect(result.dataValues.products[0].dataValues.id).toEqual(input.products[0].id.id);
    expect(result.dataValues.products[0].dataValues.name).toEqual(input.products[0].name);
    expect(result.dataValues.products[0].dataValues.salesPrice).toEqual(input.products[0].salesPrice);

    expect(result.dataValues.products[1].dataValues.id).toEqual(input.products[1].id.id);
    expect(result.dataValues.products[1].dataValues.name).toEqual(input.products[1].name);
    expect(result.dataValues.products[1].dataValues.salesPrice).toEqual(input.products[1].salesPrice);
  });
});
