import { MapPoint } from '../../../app/@types/map-point.types';
import { IAddress } from './address.interface';

export interface IProperty {

  id?:string;
  name:string;
  cnpj: string;
  company: string;
  description: string;
  mapPoints: MapPoint[];
  size: number;
  status: string;
  address: IAddress
  propertyActivities:string[]
  ownerId:string
  active:boolean
}


