import Invoice from "../domain/entity/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(entity: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: entity.id.id,
        name: entity.name,
        document: entity.document,
        street: entity.address.street,
        number: entity.address.number,
        city: entity.address.city,
        zipcode: entity.address.zipcode,
        items: entity.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
      { include: [{ model: InvoiceItemsModel }] }
    );
  }
  find(id: string): Promise<Invoice> {
    throw new Error("Method not implemented.");
  }
}
