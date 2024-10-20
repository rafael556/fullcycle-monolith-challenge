import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import FindAllProductsUseCase from "./find-all-products.usecase"

const product1 = new Product({
    id: new Id('1'),
    name: 'product 1',
    description: 'product 1 description',
    salesPrice: 100,
})

const product2 = new Product({
    id: new Id('2'),
    name: 'product 2',
    description: 'product 2 description',
    salesPrice: 200,
})

const MockRepository = () => {
    return {
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
        find: jest.fn(),
    }
}

describe('find all products use case unit test', () => {

    it('should find all products', async () => {
        const productRepository = MockRepository();
        const usecase = new FindAllProductsUseCase(productRepository);

        const result = await usecase.execute();

        expect(productRepository.findAll).toHaveBeenCalled();
        expect(result.products.length).toBe(2);

        const result1 = result.products[0];
        const result2 = result.products[1];

        expect(result1.id).toBe(product1.id.id);
        expect(result1.name).toBe(product1.name);
        expect(result1.description).toBe(product1.description);
        expect(result1.salesPrice).toBe(product1.salesPrice);

        expect(result2.id).toBe(product2.id.id);
        expect(result2.name).toBe(product2.name);
        expect(result2.description).toBe(product2.description);
        expect(result2.salesPrice).toBe(product2.salesPrice);
    })
})