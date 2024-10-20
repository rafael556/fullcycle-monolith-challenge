import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductAdmFactory from "../factory/facade.factory";

describe('productAdmFacade test', () => {
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

  it('should create a product', async() => {
    const productFacade = ProductAdmFactory.create();

    const input = {
        id: '1',
        name: 'product 1',
        description: 'product 1 description',
        purchasePrice: 10,
        stock: 10
    }

    await productFacade.addProduct(input);

    const productDb = await ProductModel.findOne({
        where: { id: input.id },
      });
  
      expect(productDb.dataValues.id).toEqual(input.id);
      expect(productDb.dataValues.name).toEqual(input.name);
      expect(productDb.dataValues.description).toEqual(input.description);
      expect(productDb.dataValues.purchasePrice).toEqual(input.purchasePrice);
      expect(productDb.dataValues.stock).toEqual(input.stock);
  })

  it('should check stock of a product', async() => {
    await ProductModel.create({
        id: '1',
        name: 'product 1',
        description: 'product 1 description',
        purchasePrice: 10,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    const productFacade = ProductAdmFactory.create();

    const result = await productFacade.checkStock({productId: '1'});

    expect(result.productId).toBe('1');
    expect(result.stock).toBe(10);
  })
})