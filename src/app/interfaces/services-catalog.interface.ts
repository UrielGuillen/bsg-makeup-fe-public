import { BaseResponse } from './base-response.interface';

export interface ServicesCatalogResponse extends BaseResponse {
  response: {
    servicesCatalog: Array<ServicesCatalog>;
    microCatalog: Array<ServicesCatalog>;
  };
}

export interface ServicesCatalog {
  id: string;
  description: string;
  name: string;
  time: number;
  cost: number;
  group: string;
}
