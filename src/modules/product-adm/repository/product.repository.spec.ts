import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("product repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const props = {
      id: new Id("1"),
      name: "product 1",
      description: "product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const product = new Product(props);
    const productRepository = new ProductRepository();
    await productRepository.add(product);

    const productDb = await ProductModel.findOne({
      where: { id: props.id.id },
    });

    expect(productDb.dataValues.id).toEqual(props.id.id)
    expect(productDb.dataValues.name).toEqual(props.name)
    expect(productDb.dataValues.description).toEqual(props.description)
    expect(productDb.dataValues.purchasePrice).toEqual(props.purchasePrice)
    expect(productDb.dataValues.stock).toEqual(props.stock)
  });
});
