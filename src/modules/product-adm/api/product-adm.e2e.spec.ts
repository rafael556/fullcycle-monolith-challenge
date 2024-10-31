import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import { Umzug } from "umzug";
import { migrator } from "../../../migrations/config-migrations/migrator";
import request from "supertest";
import { app } from "../../../api/express";

describe("e2e product adm test", () => {
  let migration: Umzug<any>;
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
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

  it("should create a product", async () => {
    const input = {
      id: "1",
      name: "product 1",
      description: "product 1 description",
      purchasePrice: 10,
      stock: 10,
    };

    const response = await request(app).post("/products").send(input);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Product created successfully");
  });
});
