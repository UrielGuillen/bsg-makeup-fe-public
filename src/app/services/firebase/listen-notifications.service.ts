import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { Subscription, take } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NotificationCentreService } from '../notification-centre.service';
import { AuthenticationService } from '../authentication.service';
import { NotificationService } from '../core/notification.service';
import { TokenUserResponse } from '../../interfaces/token-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ListenNotificationsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private messageListener!: any;

  constructor(private notificationCentreService: NotificationCentreService,
              private authService: AuthenticationService,
              private notificationsService: NotificationService) { }

  public requestPermission(): void {
    // eslint-disable-next-line @typescript-eslint/typedef
    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then((currentToken) => {
      if (currentToken && currentToken !== this.authService.getDataFromToken('currentToken')) {
        const saveTokenSubscription: Subscription = this.notificationCentreService.saveUserToken(currentToken)
          .pipe(take(1)).subscribe((response: TokenUserResponse) => {
            if (response.success) {
              this.authService.saveToken(response);
            }

            saveTokenSubscription.unsubscribe();
          });
      }
    });
  }

  public listen(): void {
    // eslint-disable-next-line @typescript-eslint/typedef
    const messaging = getMessaging();

    this.messageListener = onMessage(messaging, (payload) => {
      const message: string = (payload && payload.notification) ? payload.notification.body as string : '';

      this.notificationCentreService.setNewNotifications(true);
      this.notificationsService.showToast({ message, type: 'info' });
    });
  }

  public removeListeners(): void {
    // eslint-disable-next-line @typescript-eslint/typedef
    const messaging = getMessaging();

    if (this.messageListener) {
      this.messageListener();

      deleteToken(messaging).then();

      const removeTokenSubs: Subscription = this.notificationCentreService.removeUserToken()
        .subscribe(() => removeTokenSubs.unsubscribe());
    }
  }
}
