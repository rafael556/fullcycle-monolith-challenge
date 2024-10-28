import { Sequelize } from "sequelize-typescript";
import InvoiceItemsModel from "./invoice-items.model";
import Invoice from "../domain/entity/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/value-object/address.value-object";
import InvoiceItems from "../domain/entity/invoice-items.entity";
import InvoiceRepository from "./invoice.repository";
import InvoiceModel from "./invoice.model";

describe("invoice repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "invoice 1",
      document: "doc 1",
      address: new Address({
        street: "st1",
        number: 1,
        city: "city 1",
        zipcode: "zip 1",
      }),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "item 1",
          price: 100,
        }),
      ],
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const result = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: ["items"],
    });

    expect(result.dataValues.id).toEqual(invoice.id.id);
    expect(result.dataValues.name).toEqual(invoice.name);
    expect(result.dataValues.document).toEqual(invoice.document);

    expect(result.dataValues.street).toEqual(invoice.address.street);
    expect(result.dataValues.number).toEqual(invoice.address.number);
    expect(result.dataValues.city).toEqual(invoice.address.city);
    expect(result.dataValues.zipcode).toEqual(invoice.address.zipcode);

    // Verificação dos itens da fatura
    expect(result.dataValues.items).toHaveLength(invoice.items.length);
    expect(result.dataValues.items[0].dataValues.id).toEqual(
      invoice.items[0].id.id
    );
    expect(result.dataValues.items[0].dataValues.name).toEqual(
      invoice.items[0].name
    );
    expect(result.dataValues.items[0].dataValues.price).toEqual(
      invoice.items[0].price
    );
  });

  it("should find an invoice", async () => {
    await InvoiceModel.create(
      {
        id: '1',
        name: "invoice 1",
        document: "doc 1",
        street: "st1",
        number: 1,
        city: "city 1",
        zipcode: "zip 1",
        items: [
          {
            id: '1',
            name: "item 1",
            price: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            name: "item 2",
            price: 200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: [{ model: InvoiceItemsModel }] }
    );

    const repository = new InvoiceRepository();
    const result = await repository.find('1');

        expect(result.id.id).toEqual('1');
        expect(result.name).toEqual("invoice 1");
        expect(result.document).toEqual("doc 1");
    
        expect(result.address.street).toEqual("st1");
        expect(result.address.number).toEqual(1);
        expect(result.address.city).toEqual("city 1");
        expect(result.address.zipcode).toEqual("zip 1");
    
        expect(result.items).toHaveLength(2);
    
        expect(result.items[0].id.id).toEqual('1');
        expect(result.items[0].name).toEqual("item 1");
        expect(result.items[0].price).toEqual(100);
    
        expect(result.items[1].id.id).toEqual('2');
        expect(result.items[1].name).toEqual("item 2");
        expect(result.items[1].price).toEqual(200);
  });
});
