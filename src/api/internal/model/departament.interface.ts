export interface IDepartament {
  id: string;
  name: string;
  functions: string;
  description: string;
  functionsList: IFunctionsList[];
}

export interface IFunctionsList {
  id: string;
  name: string;
  description: string;
}
