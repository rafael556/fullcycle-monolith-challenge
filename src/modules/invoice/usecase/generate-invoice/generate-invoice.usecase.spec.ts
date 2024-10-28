import GenerateInvoiceUsecase from "./generate-invoice.usecase";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn(),
    }
}

describe('generate invoice use case unit test', () => {

    it('should generate am invoice', async() => {
        const repository = MockRepository();
        const usecase = new GenerateInvoiceUsecase(repository);
    
        const input: GenerateInvoiceUseCaseInputDto = {
            id: '1',
            name: "invoice 1",
            document: "doc 1",
            street: "st1",
            number: '1',
            city: "city 1",
            zipCode: "zip 1",
            complement: "N/A",
            state: "RJ",
            items: [
                {
                    id: "1",
                    name: "item 1",
                    price: 100
                }
            ],
        }

        const result: GenerateInvoiceUseCaseOutputDto = await usecase.execute(input);

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
    
        expect(result.items).toHaveLength(input.items.length);
        expect(result.items[0].id).toEqual(input.items[0].id);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
    
        const total = input.items.reduce((sum, item) => sum + item.price, 0);
        expect(result.total).toEqual(total);
    })
})