import { IAddress } from './address.interface';

export interface IEmployee {
  name: string;
  cpf: string;
  rg: string;
  cnh: string;
  category_cnh: string[];
  maturity_cnh: Date;
  admission: Date;
  birth: Date;
  sex: string;
  phone: string;
  email: string;
  pis: string;
  cbo: string;
  salary: number;
  functionId: string;
  address?: IAddress;
  addressId?: string;
}

export interface Employees {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  cpf: string;
  rg: string;
  cnh: string;
  category_cnh: string[];
  maturity_cnh: Date;
  email: string;
  phone: string;
  birth: Date;
  addressId: string;
  address: IAddress;
  admission: Date;
  salary: string;
  cbo: string;
  pis: string;
  sex: string;
  demission: null;
  propertyId: null;
  property: null;
  active: boolean;
}
