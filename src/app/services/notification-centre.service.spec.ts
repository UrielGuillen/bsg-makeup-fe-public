import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import {
  NotificationResponse,
  NotificationsResponse,
  RemoveNotificationResponse,
} from '../interfaces/notifications.interface';
import { BaseResponse } from '../interfaces/base-response.interface';
import { TokenUserResponse } from '../interfaces/token-response.interface';

import { NotificationCentreService } from './notification-centre.service';

describe('NotificationCentreService', () => {
  let service: NotificationCentreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        NotificationCentreService,
      ],
    });

    service = TestBed.inject(NotificationCentreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get notifications', (done: DoneFn) => {
    service.getNotifications()
      .subscribe((response: NotificationsResponse) => {
        expect(response.success).toBeTruthy();
        done();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/notifications');

    expect(request.request.method).toBe('GET');

    request.flush({ success: true, message: 'Notifications retrieved' });
  });

  it('should mark notification as read', (done: DoneFn) => {
    service.markNotificationAsRead('1')
      .subscribe((response: NotificationResponse) => {
        expect(response.success).toBeTruthy();
        done();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/notifications/read');

    expect(request.request.method).toBe('PUT');

    request.flush({ success: true, message: 'Notification updated' });
  });

  it('should mark all notifications as read', (done: DoneFn) => {
    service.markAllNotificationsAsRead()
      .subscribe((response: NotificationsResponse) => {
        expect(response.success).toBeTruthy();
        done();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/notifications/read/all');

    expect(request.request.method).toBe('PUT');

    request.flush({ success: true, message: 'Notification updated' });
  });

  it('should delete the notification given', (done: DoneFn) => {
    service.deleteNotification('1')
      .subscribe((response: RemoveNotificationResponse) => {
        expect(response.success).toBeTruthy();
        done();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/notifications/delete?notificationId=1');

    expect(request.request.method).toBe('DELETE');

    request.flush({ success: true, message: 'Notification deleted' });
  });

  it('should delete all notifications', (done: DoneFn) => {
    service.deleteAllNotifications()
      .subscribe((response: BaseResponse) => {
        expect(response.success).toBeTruthy();
        done();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/notifications/delete/all');

    expect(request.request.method).toBe('DELETE');

    request.flush({ success: true, message: 'Notifications deleted' });
  });

  it('should set new notifications indicator', (done: DoneFn) => {
    service.setNewNotifications(true);

    service.getNewNotifications().subscribe((newNotifications: boolean) => {
      expect(newNotifications).toBeTruthy();

      done();
    });
  });

  it('should save user token', (done: DoneFn) => {
    service.saveUserToken('123')
      .subscribe((response: TokenUserResponse) => {
        expect(response.success).toBeTruthy();
        done();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/notifications/save-user-token');

    expect(request.request.method).toBe('POST');

    request.flush({ success: true, message: 'User token saved' });
  });

  it('should remove user token', (done: DoneFn) => {
    service.removeUserToken()
      .subscribe((response: BaseResponse) => {
        expect(response.success).toBeTruthy();
        done();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/notifications/delete-user-token');

    expect(request.request.method).toBe('DELETE');

    request.flush({ success: true, message: 'User token saved' });
  });
});
