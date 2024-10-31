import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import { AddClientFacadeInputDto } from "../facade/client-adm.facade.dto";
import { app } from "../../../api/express";
import { Umzug } from "umzug";
import { migrator } from "../../../migrations/config-migrations/migrator";

describe("e2e client adm test", () => {
  let migration: Umzug<any>;
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
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

  it("should create a client", async () => {
    const input: AddClientFacadeInputDto = {
      id: "1",
      name: "client 1",
      email: "x@x.com",
      document: "0000",
      city: "city",
      complement: "",
      number: "1",
      state: "RJ",
      street: "st1",
      zipCode: "000",
    };

    const response = await request(app).post("/clients").send(input);

    expect(response.status).toBe(201);

    expect(response.body.id).toEqual(input.id);
    expect(response.body.name).toEqual(input.name);
    expect(response.body.email).toEqual(input.email);
    expect(response.body.street).toEqual(input.street);
    expect(response.body.number).toEqual(input.number);
    expect(response.body.complement).toEqual(input.complement);
    expect(response.body.city).toEqual(input.city);
    expect(response.body.zipCode).toEqual(input.zipCode);
    expect(response.body.state).toEqual(input.state);
  });
});
