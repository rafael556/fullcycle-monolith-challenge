import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../../migrations/config-migrations/migrator";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceModel from "../repository/invoice.model";
import { Umzug } from "umzug";
import request from "supertest";
import { app } from "../../../api/express";
import { FindInvoiceFacadeOutputDTO } from "../facade/invoice.facade.dto";

describe("e2e invoice test", () => {
  let migration: Umzug<any>;
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should find an invoice", async () => {
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

    const response = await request(app).get("/invoice/1");
    const result: FindInvoiceFacadeOutputDTO = response.body;

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
