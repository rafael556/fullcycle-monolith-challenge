import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./product-adm.facade.interface";

export interface UseCasesProps {
    addUseCase: UseCaseInterface;
    checkStockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {

    private readonly _addUsecase: UseCaseInterface;
    private readonly _checkStockUsecase: UseCaseInterface;
    
    constructor(usecasesProps: UseCasesProps) {
        this._addUsecase = usecasesProps.addUseCase;
        this._checkStockUsecase = usecasesProps.checkStockUseCase;
    }

  addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return this._addUsecase.execute(input);
  }

  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUsecase.execute(input);
  }
}
