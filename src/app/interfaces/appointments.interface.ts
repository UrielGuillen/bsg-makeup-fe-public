import { AppointmentStatus } from '../enums/appointment-status.enum';
import { FeedbackStatus } from '../enums/feedback-status.enum';

import { BaseResponse } from './base-response.interface';

export interface AppointmentsResponse extends BaseResponse {
  response: Array<Appointments>;
}

export interface AppointmentResponse extends BaseResponse {
  response: Appointments | null;
}

export interface Appointments {
  id: string;
  scheduledDate: string;
  time: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  serviceTime: number;
  userPhoneNumber: string;
  status: AppointmentStatus;
  serviceCost: number;
  feedback?: string;
  feedbackStatus?: FeedbackStatus | null;
  tempFeedback: string;
  topPosition: number;
  containerHeight: number;
}
