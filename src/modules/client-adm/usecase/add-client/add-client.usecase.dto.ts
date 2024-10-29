export interface AddClientInputDto {
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

export interface AddClientOutputDto {
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