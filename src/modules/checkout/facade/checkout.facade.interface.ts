import { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./checkout.facade.dto";

export default interface CheckoutFacadeInterface {
    addOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
}