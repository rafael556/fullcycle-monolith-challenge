import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItems from "../../domain/entity/invoice-items.entity"
import Invoice from "../../domain/entity/invoice.entity"
import Address from "../../domain/value-object/address.value-object"
import FindInvoiceUseCase from "./find-invoice.usecase"
import { FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto"

const invoice = new Invoice({
    id: new Id('1'),
    document: 'doc 1',
    name: 'invoice 1',
    address: new Address({
        street: 'st 1',
        city: 'ct 1',
        complement: 'N/A',
        number: '1',
        state: 'RJ',
        zipcode: 'zip'
    }),
    items: [
        new InvoiceItems({
            id: new Id('1'),
            name: 'item 1',
            price: 100,
        })
    ]
})

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    }
}

describe('fin invoice use case unit test', () => {
    it('should find an invoice', async () => {
        const repository = MockRepository();
        const usecase = new FindInvoiceUseCase(repository);
    
        const result: FindInvoiceUseCaseOutputDTO = await usecase.execute({ id: '1' });
    
        expect(result.id).toEqual('1');
        expect(result.name).toEqual('invoice 1');
        expect(result.document).toEqual('doc 1');
    
        // Verificando os detalhes do endereço
        expect(result.address.street).toEqual('st 1');
        expect(result.address.city).toEqual('ct 1');
        expect(result.address.complement).toEqual('N/A');
        expect(result.address.number).toEqual('1');
        expect(result.address.state).toEqual('RJ');
        expect(result.address.zipCode).toEqual('zip');
    
        // Verificando os itens
        expect(result.items).toHaveLength(1);
        expect(result.items[0].id).toEqual('1');
        expect(result.items[0].name).toEqual('item 1');
        expect(result.items[0].price).toEqual(100);
    
        // Verificando o total
        const total = result.items.reduce((sum, item) => sum + item.price, 0);
        expect(result.total).toEqual(total);
    
        // Verificando o campo createdAt
        expect(result.createdAt).toBeInstanceOf(Date);
    });
    
})