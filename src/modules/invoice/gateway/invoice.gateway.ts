import Invoice from "../domain/entity/invoice.entity";

export default interface InvoiceGateway {
    generate(entity: Invoice): Promise<void>;
    find(id: string): Promise<Invoice>;
}