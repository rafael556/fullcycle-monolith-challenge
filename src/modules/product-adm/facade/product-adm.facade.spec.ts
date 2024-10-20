import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";

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
    const productRepository = new ProductRepository();
    const addProductUseCase = new AddProductUseCase(productRepository);
    const productFacade = new ProductAdmFacade({
        addUseCase: addProductUseCase,
        checkStockUseCase: undefined
    });

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
})