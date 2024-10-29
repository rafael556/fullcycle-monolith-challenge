import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import FindClientUseCase from "./find-client.usecase"

const client = new Client({
    id: new Id('1'),
    name: 'client 1',
    email: 'client@email.com',
    document: "0000",
    city: "city",
    complement: "",
    number: "1",
    state: "RJ",
    street: "st1",
    zipCode: "000",
})
const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
    }
}

describe('find client usecase unit test', () => {

    it('should find a client', async() => {
        const repository = MockRepository();
        const usecase = new FindClientUseCase(repository);

        const client = await usecase.execute({id: '1'});

        expect(client.id).toEqual('1');
        expect(client.name).toEqual('client 1');
        expect(client.email).toEqual('client@email.com');
        expect(client.street).toEqual('st1');
    })
})