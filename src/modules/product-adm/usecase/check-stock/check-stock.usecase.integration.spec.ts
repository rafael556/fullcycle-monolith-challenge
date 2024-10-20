import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../repository/product.model";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";
import ProductRepository from "../../repository/product.repository";
import CheckStockUseCase from "./check-stock.usecase";

describe('check stock use case integration test', () => {
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

    it('should check stock of a product', async () => {
        const productRepository = new ProductRepository();
        const usecase = new CheckStockUseCase(productRepository);
        
        await ProductModel.create({
            id: '1',
            name: 'product 1',
            description: 'product 1 description',
            purchasePrice: 10,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const input: CheckStockInputDto = {
            productId: '1'
        };

        const result: CheckStockOutputDto = await usecase.execute(input);

        expect(result.productId).toEqual('1');
        expect(result.stock).toEqual(10);
    })
})