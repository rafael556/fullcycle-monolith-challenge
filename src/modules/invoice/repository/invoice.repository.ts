import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/entity/invoice-items.entity";
import Invoice from "../domain/entity/invoice.entity";
import Address from "../domain/value-object/address.value-object";
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
  async find(id: string): Promise<Invoice> {
    const invoiceResult = await InvoiceModel.findOne({
      where: { id },
      include: ["items"],
    });

    if (!invoiceResult) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    const invoiceItems = invoiceResult.dataValues.items.map( (item: { dataValues: { id: string; name: string; price: number; createdAt: Date; updatedAt: Date; }; }) =>
          new InvoiceItems({
            id: new Id(item.dataValues.id),
            name: item.dataValues.name,
            price: item.dataValues.price,
            createdAt: item.dataValues.createdAt,
            updatedAt: item.dataValues.updatedAt,
          })
      )

    return new Invoice({
      id: new Id(invoiceResult.dataValues.id),
      name: invoiceResult.dataValues.name,
      document: invoiceResult.dataValues.document,
      address: new Address({
        street: invoiceResult.dataValues.street,
        number: invoiceResult.dataValues.number,
        city: invoiceResult.dataValues.city,
        zipcode: invoiceResult.dataValues.zipcode,
      }),
      items: invoiceItems,
      createdAt: invoiceResult.dataValues.createdAt,
      updatedAt: invoiceResult.dataValues.updatedAt,
    });
  }
}
