import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-products/find-products.usecase";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogFacadeOutputDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
    findAllUseCase: FindAllProductsUseCase,
    findUseCase: FindProductUseCase
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {

    private readonly _findAllUseCase: FindAllProductsUseCase;
    private readonly _findUseCase: FindProductUseCase;

    constructor(props: UseCaseProps) {
        this._findAllUseCase = props.findAllUseCase;
        this._findUseCase = props.findUseCase;
    }
    
    async find(input: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
        return await this._findUseCase.execute(input);
    }

    async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
        return await this._findAllUseCase.execute();
    }

}