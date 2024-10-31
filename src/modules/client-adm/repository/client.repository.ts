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
            document: client.document,
            city: client.city,
            complement: client.complement,
            number: client.number,
            state: client.state,
            street: client.street,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        })
    }

    async find(id: string): Promise<Client> {
        const client = await ClientModel.findOne({where: {id}});

        if(!client) {
            throw new Error('Client not found');
        }

        return new Client({
            id: new Id(client.dataValues.id),
            name: client.dataValues.name,
            email: client.dataValues.email,
            document: client.dataValues.document,
            street: client.dataValues.street,
            number: client.dataValues.number,
            complement: client.dataValues.complement,
            city: client.dataValues.city,
            state: client.dataValues.state,
            zipCode: client.dataValues.zipCode,
            createdAt: client.dataValues.createdAt,
            updatedAt: client.dataValues.updatedAt,
        })
    }
}