export interface Bovine {
  id?: string;
  name: string;
  birthDate: string;
  sex: 'M' | 'F';
  situation: string;
  modality: string;
  phaseCut: string;
  phaseMilk: string;
  fatherId?: string;
  motherId?: string;
  arealId?: string;
  breedId?: string;
}
