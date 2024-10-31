import express, { Request, Response } from 'express'
import ClientAdmFacadeFactory from '../factory/client-adm.factory';
import { AddClientFacadeInputDto } from '../facade/client-adm.facade.dto';

export const clientRoute = express.Router();

clientRoute.post('/', async(req: Request, res: Response) => {
    const clientFacade = ClientAdmFacadeFactory.create();

    try {
        const input: AddClientFacadeInputDto = req.body;
        await clientFacade.add(input);
        
        const result = await clientFacade.find({id: input.id});
        res.status(201).json(result);
    } catch (error) {
        res.status(500).send(error);
    }
})