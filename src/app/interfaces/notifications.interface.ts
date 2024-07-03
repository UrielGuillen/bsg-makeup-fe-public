import { BaseResponse } from './base-response.interface';

export interface NotificationsResponse extends BaseResponse {
  response: Array<Notification>;
}

export interface NotificationResponse extends BaseResponse {
  response: Notification;
}

export interface RemoveNotificationResponse extends BaseResponse {
  response: string;
}

export interface Notification {
  id: string;
  userIdFrom: string;
  userIdTo: string;
  title: string;
  content: string;
  icon: string;
  hasBeenRead: boolean;
  createdAt: number;
}
