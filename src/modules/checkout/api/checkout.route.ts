import express, { Request, Response } from 'express'
import CheckoutFacadeFactory from '../factory/checkout.factory';
import { PlaceOrderFacadeInputDto } from '../facade/checkout.facade.dto';

export const checkoutRoute = express.Router();

checkoutRoute.post('/',async(req: Request, res: Response) => {
    const checkoutFacade = CheckoutFacadeFactory.create();

    try {
        const input: PlaceOrderFacadeInputDto = {
            clientId: req.body.clientId,
            products: req.body.products
        }
    
        const result = await checkoutFacade.addOrder(input);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(error);
    }
})