import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./checkout.facade.dto";
import CheckoutFacadeInterface from "./checkout.facade.interface";

type UseCaseProps = {
    addOrder: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
    private readonly _addOrderUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._addOrderUseCase = props.addOrder;
    }
    
    async addOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        return await this._addOrderUseCase.execute(input);
    }
}