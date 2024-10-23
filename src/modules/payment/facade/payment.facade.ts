import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PaymentFacadeInterface, {
  PaymentFacadeInputDto,
  PaymentFacadeOutputDto,
} from "./facade.interface";

type TransactionProps = {
    processPayment: UseCaseInterface;
}

export default class PaymentFacade implements PaymentFacadeInterface {

    private readonly _processPaymentUseCase: UseCaseInterface;
    
    constructor(props: TransactionProps) {
        this._processPaymentUseCase = props.processPayment;
    }
    
  async process(
    input: PaymentFacadeInputDto
  ): Promise<PaymentFacadeOutputDto> {
    return await this._processPaymentUseCase.execute(input);
  }
}
