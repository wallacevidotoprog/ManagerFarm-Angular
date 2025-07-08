import { ListKeyView } from "../@types/default.types";
import { FarmActivityType } from "../Models/enum/property.enum";

export const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export const cnhCategory = ['A', 'B', 'C', 'D', 'E'];

export const sex = ['MASCULINO', 'FEMININO', 'OUTROS'];

export const PropertyStatusList = [
  { key: 'NONE', view: 'Nenhum' },
  { key: 'ACTIVE', view: 'Ativa' },
  { key: 'INACTIVE', view: 'Inativa' },
  { key: 'LEASED', view: 'Arrendada' },
];


export const FarmActivityTypeList : ListKeyView[] = [
  { key: 'BOVINE_CULTURE', view: 'Pecuária bovina' },
  { key: 'MILK_PRODUCTION', view: 'Produção de leite' },
  { key: 'AGRICULTURE', view: 'Agricultura' },
  { key: 'POULTRY', view: 'Avicultura' },
  { key: 'PIG_FARMING', view: 'Suinocultura' },
  { key: 'FISH_FARMING', view: 'Piscicultura' },
  { key: 'HORSE_BREEDING', view: 'Equinocultura' },
  { key: 'SHEEP_FARMING', view: 'Ovinocultura' },
  { key: 'GOAT_FARMING', view: 'Caprinocultura' },
  { key: 'SILVICULTURE', view: 'Silvicultura' },
  { key: 'HORTICULTURE', view: 'Horticultura' },
  { key: 'BEEKEEPING', view: 'Apicultura' },
  { key: 'AQUACULTURE', view: 'Aquicultura' },
  { key: 'OTHER', view: 'Outras atividades' },
];

