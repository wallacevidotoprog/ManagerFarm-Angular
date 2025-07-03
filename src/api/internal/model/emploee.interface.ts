import { IAddress } from "./address.interface";

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
  salary: string; 
  functionId: string;
  address?: IAddress;
  addressId?:string;
}
