import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AppMaterialModule } from '../../modules/app.material.module';
import { SharedModule } from '../../modules/shared.module';
import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { MOCK_NOTIFICATIONS_LIST } from '../../mocks/mock-notification-list';
import { MOCK_NOTIFICATION_SERVICE } from '../../mocks/mock-notification-service';
import { getUserNotifications } from '../../../state/authentication/authentication-selectors';
import { NotificationService } from '../../services/core/notification.service';
import {
  RequestAlertMarkedAsRead,
  RequestDeleteAlert, RequestDeleteAllAlerts,
  RequestMarkAllAlertsAsRead,
} from '../../../state/authentication/authentication-actions';

import { AlertsComponent } from './alerts.component';

describe('AlertsComponent', () => {
  let store: MockStore;
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AlertsComponent,
      ],
      imports: [
        AppMaterialModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        provideMockStore({ initialState: MOCK_INITIAL_STATE }),
        { provide: NotificationService, useValue: MOCK_NOTIFICATION_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(getUserNotifications, MOCK_NOTIFICATIONS_LIST);

    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark notification as read', () => {
    spyOn(store, 'dispatch');

    component.markNotificationAsRead('1');

    expect(store.dispatch).toHaveBeenCalledWith(RequestAlertMarkedAsRead('1'));
  });

  it('should delete notification', () => {
    spyOn(store, 'dispatch');

    component.deleteNotification('1');

    expect(store.dispatch).toHaveBeenCalledWith(RequestDeleteAlert('1'));
  });

  it('should mark all notifications as read', () => {
    MOCK_NOTIFICATION_SERVICE.confirm.and.returnValue(of({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    }));

    spyOn(store, 'dispatch');

    component.markAllAsRead();

    expect(store.dispatch).toHaveBeenCalledWith(RequestMarkAllAlertsAsRead());
  });

  it('should delete all notifications', () => {
    MOCK_NOTIFICATION_SERVICE.confirm.and.returnValue(of({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    }));

    spyOn(store, 'dispatch');

    component.deleteAllNotifications();

    expect(store.dispatch).toHaveBeenCalledWith(RequestDeleteAllAlerts());
  });
});
