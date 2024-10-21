import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import { ClientModel } from "./client.model";

export default class ClientRepository implements ClientGateway {
    async add(client: Client): Promise<void> {
        await ClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        })
    }

    async find(id: string): Promise<Client> {
        const client = await ClientModel.findOne({where: {id}});

        return new Client({
            id: new Id(client.dataValues.id),
            name: client.dataValues.name,
            email: client.dataValues.email,
            address: client.dataValues.address,
            createdAt: client.dataValues.createdAt,
            updatedAt: client.dataValues.updatedAt,
        })
    }
}