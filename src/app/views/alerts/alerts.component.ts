import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';

import { AppState } from '../../../state/state.model';
import { Notification } from '../../interfaces/notifications.interface';
import { getUserNotifications } from '../../../state/authentication/authentication-selectors';
import {
  RequestAlertMarkedAsRead,
  RequestDeleteAlert, RequestDeleteAllAlerts,
  RequestMarkAllAlertsAsRead,
} from '../../../state/authentication/authentication-actions';
import { NotificationService } from '../../services/core/notification.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent implements OnInit, OnDestroy {

  public notificationsList$: Observable<Array<Notification>> = of([]);

  private subscriptions: Array<Subscription> = [];

  constructor(private store$: Store<AppState>,
              private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initNotificationsListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }

  public markNotificationAsRead(notificationId: string): void {
    this.store$.dispatch(RequestAlertMarkedAsRead(notificationId));
  }

  public deleteNotification(notificationId: string): void {
    this.store$.dispatch(RequestDeleteAlert(notificationId));
  }

  public markAllAsRead(): void {
    this.subscriptions.push(
      this.initConfirmationDialog('ALERTS_VIEW.MARK_ALL_CONFIRM_TITLE', 'ALERTS_VIEW.CONFIRM_MESSAGE')
        .subscribe((response: SweetAlertResult) => {
          if (response.isConfirmed) {
            this.store$.dispatch(RequestMarkAllAlertsAsRead());
          }
        }),
    );
  }

  public deleteAllNotifications(): void {
    this.subscriptions.push(
      this.initConfirmationDialog('ALERTS_VIEW.DELETE_ALL_CONFIRM_TITLE', 'ALERTS_VIEW.CONFIRM_MESSAGE')
        .subscribe((response: SweetAlertResult) => {
          if (response.isConfirmed) {
            this.store$.dispatch(RequestDeleteAllAlerts());
          }
        }),
    );
  }

  public isMarkAllAvailable(notifications: Array<Notification>): boolean {
    const unReadNotifications: number = notifications.filter((notification: Notification) => !notification.hasBeenRead).length;

    return notifications.length > 0 && unReadNotifications > 0;
  }

  private initNotificationsListener(): void {
    this.notificationsList$ = this.store$.select(getUserNotifications);
  }

  private initConfirmationDialog(title: string, message: string): Observable<SweetAlertResult> {
    return this.notificationService.confirm({
      message,
      title,
      showCancelButton: true,
      type: 'info',
    });
  }
}
