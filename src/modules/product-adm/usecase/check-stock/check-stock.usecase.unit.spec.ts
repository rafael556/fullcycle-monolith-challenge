import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
    id: new Id('1'),
    name: 'product 1',
    description: 'product 1 description',
    purchasePrice: 100,
    stock: 10,
})

const Mockrepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
    }
}

describe('check stock use case unit test', () => {

    it('should check stock', async() => {
        const productRepository = Mockrepository();
        const usecase = new CheckStockUseCase(productRepository);

        const input: CheckStockInputDto = {
            productId: '1'
        };

        const result: CheckStockOutputDto = await usecase.execute(input);

        expect(result.productId).toEqual(product.id.id);
        expect(result.stock).toEqual(product.stock);
    })
})