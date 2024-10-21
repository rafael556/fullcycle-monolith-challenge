import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe("Store Catalog Facade test", () => {
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

  it("should find all products", async () => {
    await ProductModel.create({
        id: '1',
        name: 'product 1',
        description: 'product 1 description',
        salesPrice: 100,
    })

    await ProductModel.create({
        id: '2',
        name: 'product 2',
        description: 'product 2 description',
        salesPrice: 200,
    })

    const facade = StoreCatalogFacadeFactory.create();
    const result = await facade.findAll();

    expect(result.products.length).toBe(2);

    const result1 = result.products[0];
    const result2 = result.products[1];

    expect(result1.id).toBe('1');
    expect(result1.name).toBe('product 1');
    expect(result1.description).toBe('product 1 description');
    expect(result1.salesPrice).toBe(100);

    expect(result2.id).toBe('2');
    expect(result2.name).toBe('product 2');
    expect(result2.description).toBe('product 2 description');
    expect(result2.salesPrice).toBe(200);
  });

  it("should find a product", async () => {
    const facade = StoreCatalogFacadeFactory.create();
    await ProductModel.create({
      id: "1",
      name: "product 1",
      description: "product 1 description",
      salesPrice: 100,
    });

    const result = await facade.find({id: '1'});

    expect(result.id).toBe('1');
    expect(result.name).toBe('product 1');
    expect(result.description).toBe('product 1 description');
    expect(result.salesPrice).toBe(100);
  });
});
