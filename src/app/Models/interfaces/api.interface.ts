export interface IUser {
  name: string;
  cpf: string;
  email: string;
  password: string;
  phone: string;
  address: IAddress;
}

export interface IAddress {
  cep: string;
  place: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
}

export interface ICheckedAccount {
  email: string;
  key: string;
}

export interface ILogin{
  email: string;
  password: string;
}

