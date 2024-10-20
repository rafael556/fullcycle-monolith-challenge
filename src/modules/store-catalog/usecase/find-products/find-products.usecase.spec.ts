import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import { FindProductOutputDto } from "./find-products.dto"
import FindProductUseCase from "./find-products.usecase"

const product1 = new Product({
    id: new Id('1'),
    name: 'product 1',
    description: 'product 1 description',
    salesPrice: 100,
})

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product1)),
    }
}

describe('find products use case unit tests', () => {

    it('should find a product', async() => {
        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        const result: FindProductOutputDto = await usecase.execute({id: '1'});

        expect(productRepository.find).toHaveBeenCalled();
        expect(result.id).toBe('1');
        expect(result.name).toBe('product 1');
        expect(result.description).toBe('product 1 description')
        expect(result.salesPrice).toBe(100);
    })
})