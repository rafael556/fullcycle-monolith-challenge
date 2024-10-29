import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/client-adm.factory";
import { AddClientFacadeInputDto } from "./client-adm.facade.dto";

describe("client adm facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

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

    await facade.add(input);

    const result = await ClientModel.findOne({ where: { id: input.id } });

    expect(result.dataValues.id).toEqual(input.id);
    expect(result.dataValues.name).toEqual(input.name);
    expect(result.dataValues.email).toEqual(input.email);
    expect(result.dataValues.street).toEqual(input.street);
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

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

    await facade.add(input);

    const result = await facade.find({ id: "1" });

    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.street).toEqual(input.street);
  });
});
