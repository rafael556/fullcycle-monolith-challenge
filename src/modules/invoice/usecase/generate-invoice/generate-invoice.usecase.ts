import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceItems from "../../domain/entity/invoice-items.entity";
import Invoice from "../../domain/entity/invoice.entity";
import Address from "../../domain/value-object/address.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUsecase implements UseCaseInterface {
    constructor(private readonly invoiceRepository: InvoiceGateway) {}
    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const address = new Address({
            street: input.street,
            city: input.city,
            complement: input.complement,
            number: input.number,
            state: input.state,
            zipcode: input.zipCode
        });

        const invoiceItems = input.items.map((item) => new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price
        }));

        const invoice = new Invoice({
            id: new Id(input.id),
            document: input.document,
            name: input.name,
            address,
            items: invoiceItems
        })
        
        await this.invoiceRepository.generate(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipcode,
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: invoice.total(),
        }
    }
}