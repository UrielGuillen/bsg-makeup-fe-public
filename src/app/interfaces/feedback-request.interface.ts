import { FeedbackStatus } from '../enums/feedback-status.enum';

import { BaseResponse } from './base-response.interface';

export interface FeedbackRequestResponse extends BaseResponse {
  response: FeedbackRequest;
}

export interface FeedbackRequest {
  id: string;
  appointmentId: string;
  feedback: string;
  status: FeedbackStatus;
}
