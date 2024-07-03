import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, take } from 'rxjs';

import {
  NotificationResponse,
  NotificationsResponse,
  RemoveNotificationResponse,
} from '../interfaces/notifications.interface';
import { environment } from '../../environments/environment';
import { TokenUserResponse } from '../interfaces/token-response.interface';
import { BaseResponse } from '../interfaces/base-response.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationCentreService {
  private readonly prefixUrl: string = environment.api.url;
  private readonly notificationsUrl: string = this.prefixUrl + '/notifications';
  private newNotifications: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  public getNotifications(): Observable<NotificationsResponse> {
    return this.http.get<NotificationsResponse>(this.notificationsUrl).pipe(take(1));
  }

  public markNotificationAsRead(notificationId: string): Observable<NotificationResponse> {
    const marAsReadUrl: string = this.notificationsUrl + '/read';

    return this.http.put<NotificationResponse>(marAsReadUrl, notificationId).pipe(take(1));
  }

  public markAllNotificationsAsRead(): Observable<NotificationsResponse> {
    const marAsReadUrl: string = this.notificationsUrl + '/read/all';

    return this.http.put<NotificationsResponse>(marAsReadUrl,{}).pipe(take(1));
  }

  public deleteNotification(notificationId: string): Observable<RemoveNotificationResponse> {
    const deleteNotificationUrl: string = this.notificationsUrl + '/delete';

    const httpParams: HttpParams = new HttpParams()
      .set('notificationId', notificationId);

    return this.http.delete<RemoveNotificationResponse>(deleteNotificationUrl, { params: httpParams }).pipe(take(1));
  }

  public deleteAllNotifications(): Observable<BaseResponse> {
    const deleteNotificationUrl: string = this.notificationsUrl + '/delete/all';

    return this.http.delete<BaseResponse>(deleteNotificationUrl).pipe(take(1));
  }

  public setNewNotifications(newNotifications: boolean): void {
    this.newNotifications.next(newNotifications);
  }

  public getNewNotifications(): Observable<boolean> {
    return this.newNotifications.asObservable();
  }

  public saveUserToken(notificationToken: string): Observable<TokenUserResponse> {
    const saveUserTokenUrl: string = this.notificationsUrl + '/save-user-token';

    return this.http.post<TokenUserResponse>(saveUserTokenUrl, notificationToken).pipe(take(1));
  }

  public removeUserToken(): Observable<BaseResponse> {
    const saveUserTokenUrl: string = this.notificationsUrl + '/delete-user-token';

    return this.http.delete<BaseResponse>(saveUserTokenUrl).pipe(take(1));
  }
}
