import { BaseResponse } from './base-response.interface';

export interface CreateAppointmentResponse extends BaseResponse {
  response: CreateAppointment;
}

export interface CreateAppointment {
  id: string;
  scheduledDate: string;
  time: string;
  userId: string;
  serviceId: string;
  available: boolean;
  createdByAdmin: boolean;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

export interface CreateManualAppointment extends CreateAppointment {
  name: string;
  lastName: string;
  phone: string;
  userId: string;
  userExists: boolean;
}
