export interface FindClientFacadeInputDto {
    id: string;
}

export interface FindClientFacadeOutputDto {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AddClientFacadeInputDto {
    id?: string;
    name: string;
    email: string;
    address: string;
}
