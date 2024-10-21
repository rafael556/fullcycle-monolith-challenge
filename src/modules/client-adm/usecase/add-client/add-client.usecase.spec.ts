import AddClientUseCase from "./add-client.usecase"
import { AddClientInputDto } from "./add-client.usecase.dto"

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    }
}

describe('add client use case unit test', () => {
    it('should add a client', async () => {
        const productrepository = MockRepository()
        const usecase = new AddClientUseCase(productrepository);

        const input: AddClientInputDto = {
            name: 'client 1',
            email: 'client@email.com',
            address: 'address'
        }

        const result = await usecase.execute(input);

        expect(productrepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.address).toEqual(input.address);
    })
})