import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { SweetAlertIcon } from 'sweetalert2';

import { SetLoadingStatus } from '../configuration/configuration-actions';
import { LoadingStatus } from '../../app/enums/loading-status.enum';
import { SignInUser } from '../../app/interfaces/sign-in-user.interface';
import { TokenUserResponse } from '../../app/interfaces/token-response.interface';
import { UserData, UserDataResponse } from '../../app/interfaces/user-data.interface';
import { SignUpUser } from '../../app/interfaces/sign-up-user.interface';
import { ResetUserAppointments } from '../appointments/appointments-actions';
import { UsersService } from '../../app/services/users.service';
import { NotificationService } from '../../app/services/core/notification.service';
import { ImageUploadService } from '../../app/services/aws/image-upload.service';
import { AppState } from '../state.model';
import { AuthenticationService } from '../../app/services/authentication.service';
import { BaseResponse } from '../../app/interfaces/base-response.interface';
import { ListenNotificationsService } from '../../app/services/firebase/listen-notifications.service';
import { NotificationCentreService } from '../../app/services/notification-centre.service';
import {
  Notification,
  NotificationResponse,
  NotificationsResponse,
  RemoveNotificationResponse,
} from '../../app/interfaces/notifications.interface';

import * as AuthenticationActions from './authentication-actions';
import { getUserNotifications } from './authentication-selectors';

import SendData = ManagedUpload.SendData;

@Injectable()
export class AuthenticationEffects {
  // eslint-disable-next-line @typescript-eslint/typedef
  signInUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestSignIn),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap((payload: SignInUser) => {
        return this.authService.signInUser(payload).pipe(
          map((response: TokenUserResponse) => AuthenticationActions.SetUserData(this.getUserDataFromToken(response))),
          tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.Completed }))),
          tap(() => this.router.navigate([ '/feed' ])),
          catchError(() => {
            this.sendMessage('INTERCEPTOR.WRONG_SIGN_IN_CREDENTIALS', 'error');
            return of(SetLoadingStatus({ loadingStatus: LoadingStatus.Error }));
          }),
        );
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  signUpUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestSignUp),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap((payload: SignUpUser) => {
        return this.authService.signUpUser(payload).pipe(
          map((response: TokenUserResponse) => AuthenticationActions.SetUserData(this.getUserDataFromToken(response))),
          tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.Completed }))),
          tap(() => this.router.navigate([ '/feed' ])),
          catchError(() => {
            this.sendMessage('INTERCEPTOR.UNKNOWN_ERROR', 'error');
            return of(SetLoadingStatus({ loadingStatus: LoadingStatus.Error }));
          }),
        );
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  signOutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestSignOut),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      tap(() => this.listenNotificationsService.removeListeners()),
      tap(() => this.authService.signOutUser()),
      tap(() => this.store$.dispatch(AuthenticationActions.ResetUserData())),
      tap(() => this.store$.dispatch(ResetUserAppointments())),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.Completed }))),
      tap(() => this.router.navigate([ '/home' ])),
    ),
  { dispatch: false },
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  getUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestUserData),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap(() => {
        return this.userService.getUserPublicData().pipe(
          map((response: UserDataResponse) => {
            if (!response.success) {
              return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
            }

            this.store$.dispatch(AuthenticationActions.SetUserAuthenticated({ authenticated: true }));
            this.store$.dispatch(AuthenticationActions.SetUserData(response.response));
            return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
          }),
          catchError(() => {
            this.sendMessage('INTERCEPTOR.UNKNOWN_ERROR', 'error');
            return of(SetLoadingStatus({ loadingStatus: LoadingStatus.Error }));
          }),
        );
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  updateUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestUpdateUserData),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap((payload: { userData: Partial<UserData> }) => {
        return this.userService.updateBasicBasicData(payload.userData).pipe(
          map((response: UserDataResponse) => {
            if (!response.success) {
              this.sendMessage('PROFILE.PROFILE_NOT_UPDATED', 'error');
              return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
            }

            this.sendMessage('PROFILE.PROFILE_UPDATED', 'success');
            this.store$.dispatch(AuthenticationActions.UpdateUserData(response.response));
            return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
          }),
          catchError(() => {
            this.sendMessage('INTERCEPTOR.UNKNOWN_ERROR', 'error');
            return of(SetLoadingStatus({ loadingStatus: LoadingStatus.Error }));
          }),
        );
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  updateUserImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestUpdateUserImage),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      tap((payload: { previousImg: string | null; newImg: File }) => {
        if (payload.previousImg !== null) {
          this.imageUploadService
            .removePreviousProfileImage(payload.previousImg)
            .then()
            .catch(() =>
              this.sendMessage('PROFILE.REMOVE_PREVIOUS_PROFILE_IMAGE_ERROR', 'error'),
            );
        }
      }),
      switchMap(async (payload: { previousImg: string | null; newImg: File }) => {
        try {
          return await this.imageUploadService.uploadFile(payload.newImg);
        } catch {
          this.sendMessage('PROFILE.PROFILE_IMAGE_UPLOAD_ERROR', 'error');
        }
      }),
      switchMap((response: SendData) => {
        this.store$.dispatch(AuthenticationActions.SetNewUserImage({ profileImage: response.Key }));
        return this.userService.updateProfileImage(response.Key);
      }),
      map((response: BaseResponse) => {
        if (!response.success) {
          this.sendMessage('PROFILE.PROFILE_NOT_UPDATED', 'error');
          return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
        }

        this.sendMessage('PROFILE.PROFILE_UPDATED', 'success');
        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  loadUserNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestUserNotifications),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap(() => this.notificationCentreService.getNotifications()),
      map((response: NotificationsResponse) => {
        if (!response.success) {
          this.sendMessage('PROFILE.PROFILE_NOT_UPDATED', 'error');
          return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
        }

        const newNotifications: boolean = response.response.filter((notification: Notification) => !notification.hasBeenRead).length > 0;

        this.notificationCentreService.setNewNotifications(newNotifications);
        this.store$.dispatch(AuthenticationActions.SetUserNotifications({ notifications: response.response }));

        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  markNotificationAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestAlertMarkedAsRead),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap((payload: { alertId: string }) =>
        zip([
          this.notificationCentreService.markNotificationAsRead(payload.alertId),
          this.store$.select(getUserNotifications),
        ]),
      ),
      map(([ response, notifications ]: [ NotificationResponse, Array<Notification> ]) => {
        if (!response.success) {
          this.sendMessage(response.message, 'error');
          return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
        }

        this.updateNewNotificationsListener(notifications, response.response.id);
        this.store$.dispatch(AuthenticationActions.UpdateAlert(response.response.id));
        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  markAllNotificationsAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestMarkAllAlertsAsRead),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap(() => this.notificationCentreService.markAllNotificationsAsRead()),
      map((response: NotificationsResponse) => {
        if (!response.success) {
          this.sendMessage(response.message, 'error');
          return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
        }

        this.store$.dispatch(AuthenticationActions.UpdateAllAlerts());
        this.notificationCentreService.setNewNotifications(false);
        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  removeAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestDeleteAlert),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap((payload: { alertId: string }) =>
        zip([
          this.notificationCentreService.deleteNotification(payload.alertId),
          this.store$.select(getUserNotifications),
        ]),
      ),
      map(([ response, notifications ]: [ RemoveNotificationResponse, Array<Notification> ]) => {
        if (!response.success) {
          this.sendMessage(response.message, 'error');
          return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
        }

        this.updateNewNotificationsListener(notifications, response.response);
        this.store$.dispatch(AuthenticationActions.RemoveAlert(response.response));
        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  removeAllAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.RequestDeleteAllAlerts),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap(() => this.notificationCentreService.deleteAllNotifications()),
      map((response: BaseResponse) => {
        if (!response.success) {
          this.sendMessage(response.message, 'error');
          return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
        }

        this.store$.dispatch(AuthenticationActions.RemoveAllAlerts());
        this.notificationCentreService.setNewNotifications(false);
        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private router: Router,
    private notificationService: NotificationService,
    private imageUploadService: ImageUploadService,
    private authService: AuthenticationService,
    private userService: UsersService,
    private listenNotificationsService: ListenNotificationsService,
    private notificationCentreService: NotificationCentreService,
  ) {}

  private getUserDataFromToken(token: TokenUserResponse): UserData {
    this.authService.saveToken(token);
    this.store$.dispatch(
      AuthenticationActions.SetUserAuthenticated({
        authenticated: token.success,
      }),
    );

    return this.authService.getDataFromToken('user');
  }

  private sendMessage(message: string, type: SweetAlertIcon): void {
    this.notificationService.showToast({
      type,
      message,
    });
  }

  private updateNewNotificationsListener(notifications: Array<Notification>, notificationId: string): void {
    const unreadNotifications: number = notifications.filter((notification: Notification) =>
      notification.id !== notificationId && !notification.hasBeenRead,
    ).length;

    this.notificationCentreService.setNewNotifications(unreadNotifications > 0);
  }
}
