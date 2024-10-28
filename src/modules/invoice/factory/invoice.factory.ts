import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
    static create() {
        const invoiceRepository = new InvoiceRepository();
        const generateUseCase = new GenerateInvoiceUsecase(invoiceRepository);
        const findUseCase = new FindInvoiceUseCase(invoiceRepository);

        return new InvoiceFacade({
            generateUseCase: generateUseCase,
            findUseCase: findUseCase
        })
    }
}