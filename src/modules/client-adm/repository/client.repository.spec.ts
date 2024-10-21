import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe('client repository test', () => {
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

    it('should create a client', async () => {
        const client = new Client({
            id: new Id('1'),
            name: 'client 1',
            email: 'x@x.com',
            address: 'address 1'
        });

        const repository = new ClientRepository();
        await repository.add(client);

        const result = await ClientModel.findOne({where: {id: client.id.id}})

        expect(result.dataValues.id).toEqual(client.id.id);
        expect(result.dataValues.name).toEqual(client.name);
        expect(result.dataValues.email).toEqual(client.email);
        expect(result.dataValues.address).toEqual(client.address);
    })

    it('should find a client', async () => {
        const client = await ClientModel.create({
            id: '1',
            name: 'client 1',
            email: 'email@1.com',
            address: 'address',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const repository = new ClientRepository();
        const result = await repository.find('1');

        expect(result.id.id).toEqual(client.dataValues.id);
        expect(result.name).toEqual(client.dataValues.name);
        expect(result.email).toEqual(client.dataValues.email);
        expect(result.address).toEqual(client.dataValues.address);
    })
})