import Id from "../../../@shared/domain/value-object/id.value-object"
import Transaction from "../../domain/transaction"
import ProcessPaymentUseCase from "./process-payment.usecase"

const transaction1 = new Transaction({
    id: new Id('1'),
    amount: 100,
    orderId: '1',
    status: 'approved'
})

const MockRepository1 = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction1))
    }
}

const transaction2 = new Transaction({
    id: new Id('1'),
    amount: 100,
    orderId: '1',
    status: 'declined'
})

const MockRepository2 = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction2))
    }
}

describe('process payment use case unit test', () => {
    it('should create a transaction', async() => {
        const repository = MockRepository1();
        const usecase = new ProcessPaymentUseCase(repository);

        const input = {
            orderId: '1',
            amount: 100
        }

        const result = await usecase.execute(input);

        expect(repository.save).toHaveBeenCalled();
        expect(result.transactionId).toBe(transaction1.id.id);
        expect(result.orderId).toBe(transaction1.orderId);
        expect(result.status).toBe('approved');
        expect(result.amount).toBe(100);
    })

    it('should decline a transaction', async() => {
        const repository = MockRepository2();
        const usecase = new ProcessPaymentUseCase(repository);

        const input = {
            orderId: '1',
            amount: 50
        }

        const result = await usecase.execute(input);

        expect(repository.save).toHaveBeenCalled();
        expect(result.transactionId).toBe(transaction2.id.id);
        expect(result.orderId).toBe(transaction2.orderId);
        expect(result.status).toBe('declined');
        expect(result.amount).toBe(100);
    })
})