import { Sequelize } from "sequelize-typescript";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceFacadeInterface from "./invoice.facade.interface";
import {
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
} from "./invoice.facade.dto";
import InvoiceFacadeFactory from "../factory/invoice.factory";
import InvoiceModel from "../repository/invoice.model";

describe("invoice facade test", () => {
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
    const facade: InvoiceFacadeInterface = InvoiceFacadeFactory.create();

    const input: GenerateInvoiceFacadeInputDto = {
      id: "1",
      name: "invoice 1",
      document: "doc 1",
      street: "st1",
      number: "1",
      city: "city 1",
      zipCode: "zip 1",
      complement: "N/A",
      state: "RJ",
      items: [
        {
          id: "1",
          name: "item 1",
          price: 100,
        },
      ],
    };

    await facade.generate(input);

    const result = await InvoiceModel.findOne({
      where: { id: input.id },
      include: ["items"],
    });

    expect(result.dataValues.id).toEqual(input.id);
    expect(result.dataValues.name).toEqual(input.name);
    expect(result.dataValues.document).toEqual(input.document);

    expect(result.dataValues.street).toEqual(input.street);
    expect(result.dataValues.number).toEqual(input.number);
    expect(result.dataValues.city).toEqual(input.city);
    expect(result.dataValues.zipcode).toEqual(input.zipCode);
    expect(result.dataValues.complement).toEqual(input.complement);
    expect(result.dataValues.state).toEqual(input.state);

    // Verificação dos itens da fatura
    expect(result.dataValues.items).toHaveLength(input.items.length);
    expect(result.dataValues.items[0].dataValues.id).toEqual(input.items[0].id);
    expect(result.dataValues.items[0].dataValues.name).toEqual(
      input.items[0].name
    );
    expect(result.dataValues.items[0].dataValues.price).toEqual(
      input.items[0].price
    );
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    await InvoiceModel.create(
      {
        id: "1",
        name: "invoice 1",
        document: "doc 1",
        street: "st1",
        number: "1",
        city: "city 1",
        zipcode: "zip 1",
        complement: "N/A",
        state: "RJ",
        items: [
          {
            id: "1",
            name: "item 1",
            price: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
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

    const result: FindInvoiceFacadeOutputDTO = await facade.find({ id: "1" });

    expect(result.id).toEqual("1");
    expect(result.name).toEqual("invoice 1");
    expect(result.document).toEqual("doc 1");

    expect(result.address.street).toEqual("st1");
    expect(result.address.number).toEqual("1");
    expect(result.address.city).toEqual("city 1");
    expect(result.address.state).toEqual("RJ");
    expect(result.address.zipCode).toEqual("zip 1");
    expect(result.address.complement).toEqual("N/A");

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toEqual("1");
    expect(result.items[0].name).toEqual("item 1");
    expect(result.items[0].price).toEqual(100);
    expect(result.items[1].id).toEqual("2");
    expect(result.items[1].name).toEqual("item 2");
    expect(result.items[1].price).toEqual(200);

    const total = result.items.reduce((sum, item) => sum + item.price, 0);
    expect(result.total).toEqual(total);
  });
});
