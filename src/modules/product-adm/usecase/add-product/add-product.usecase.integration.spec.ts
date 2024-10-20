import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../repository/product.model";
import ProductRepository from "../../repository/product.repository";
import AddProductUseCase from "./add-product.usecase";
import { AddProductInputDto } from "./add-product.dto";


describe('add product use case integration test', () => {
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

    it('should add product', async() => {
        const productRepository = new ProductRepository();
        const usecase = new AddProductUseCase(productRepository);

        const input: AddProductInputDto = {
            name: 'product 1',
            description: 'product 1 description',
            purchasePrice: 100,
            stock: 10,
        }
        
        const result = await usecase.execute(input);

        expect(result.id).toBeDefined();
        expect(result.id).toEqual(expect.any(String));
        expect(result.name).toBe(input.name);
        expect(result.description).toBe(input.description);
        expect(result.purchasePrice).toBe(input.purchasePrice);
        expect(result.stock).toBe(input.stock);
    })
})