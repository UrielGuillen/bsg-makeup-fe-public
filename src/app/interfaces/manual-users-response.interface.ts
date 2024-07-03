import { BaseResponse } from './base-response.interface';

export interface ManualUsersResponse extends BaseResponse {
  response: Array<ManualUsers>
}

export interface ManualUsers {
  id: string;
  name: string;
  lastName: string;
  phone: string;
}
