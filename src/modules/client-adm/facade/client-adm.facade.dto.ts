export interface FindClientFacadeInputDto {
    id: string;
}

export interface FindClientFacadeOutputDto {
    id: string;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    zipCode: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AddClientFacadeInputDto {
    id?: string;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    zipCode: string;
    state: string;
}
