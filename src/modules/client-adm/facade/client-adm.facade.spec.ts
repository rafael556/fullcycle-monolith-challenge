import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";

describe('client adm facade test', () => {
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

    it('should create a client', async() => {
        const repository = new ClientRepository();
        const addusecase = new AddClientUseCase(repository);
        const facade = new ClientAdmFacade({
            addUseCase: addusecase,
            findUseCase: undefined
        });

        const input = {
            id: '1',
            name: 'client 1',
            email: 'x@x.com',
            address: 'address'
        }

        await facade.add(input);

        const result = await ClientModel.findOne({where: {id: input.id}});

        expect(result.dataValues.id).toEqual(input.id)
        expect(result.dataValues.name).toEqual(input.name)
        expect(result.dataValues.email).toEqual(input.email)
        expect(result.dataValues.address).toEqual(input.address)
    })

    it('should find a client', async() => {
        
    })
})