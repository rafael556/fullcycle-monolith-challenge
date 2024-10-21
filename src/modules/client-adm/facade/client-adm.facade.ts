import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.dto";
import ClientAdmFacadeInterface from "./client-adm.facade.interface";

export interface UseCaseProps {
    findUseCase: UseCaseInterface;
    addUseCase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {

    private readonly _findUsecase: UseCaseInterface;
    private readonly _addUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._addUseCase = props.addUseCase;
        this._findUsecase = props.findUseCase;
    }
    
    async add(input: AddClientFacadeInputDto): Promise<void> {
        return await this._addUseCase.execute(input);
    }
    find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
        throw new Error("Method not implemented.");
    }

}