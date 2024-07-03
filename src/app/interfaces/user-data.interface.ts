import { BaseResponse } from './base-response.interface';

export interface UserDataResponse extends BaseResponse {
  response: UserData;
}

export interface UserData {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  profileUrl: string | null;
}

export interface DecodedToken {
  user: UserData;
  userId: string;
  userRole: string;
  currentToken: string;
}
