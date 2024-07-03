import { createAction, props } from '@ngrx/store';

import { SignInUser } from '../../app/interfaces/sign-in-user.interface';
import { SignUpUser } from '../../app/interfaces/sign-up-user.interface';
import { UserData } from '../../app/interfaces/user-data.interface';
import { Notification } from '../../app/interfaces/notifications.interface';

enum AuthenticationActions {
  RequestSignInUser = '[Request] Sign in user',
  RequestSignUpUser = '[Request] Sign up user',
  RequestSignOutUser = '[Request] Sign out user',
  RequestUserData = '[Request] Request user data',
  RequestUpdateUserData = '[Request] Request update user data',
  RequestUpdateUserImage = '[Request] Request update user image',
  RequestUserNotifications = '[Request] Request user notifications',
  RequestDeleteAllAlerts = '[Request] Request delete all alerts',
  RequestMarkAsReadAllAlerts = '[Request] Request mark as read all alerts',
  RequestDeleteAlert = '[Request] Request delete an alert',
  RequestMarkAsReadAlert = '[Request] Request mark as read an alert',
  ResetUserData = '[Reset] Reset user data',
  SetNewUserImage = '[Set] Set new user image',
  SetUserData = '[Set] Set user data',
  SetUserAuthenticated = '[Set] Set user authenticated',
  SetUserNotifications = '[Set] Set user notifications',
  UpdateUserData = '[Update] Update user data',
  UpdateAlert = '[Update] Update an alert',
  UpdateAlerts = '[Update] Update all alerts',
  RemoveAlert = '[Remove] Remove an alert',
  RemoveAllAlerts = '[Remove] Remove all alerts'
}

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestSignIn = createAction(AuthenticationActions.RequestSignInUser, props<SignInUser>());

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestSignUp = createAction(AuthenticationActions.RequestSignUpUser, props<SignUpUser>());

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestSignOut = createAction(AuthenticationActions.RequestSignOutUser);

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestUpdateUserData = createAction(AuthenticationActions.RequestUpdateUserData, props<{ userData: Partial<UserData> }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestUpdateUserImage = createAction(
  AuthenticationActions.RequestUpdateUserImage,
  props<{ previousImg: string | null; newImg: File }>(),
);

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestUserData = createAction(AuthenticationActions.RequestUserData);

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestUserNotifications = createAction(AuthenticationActions.RequestUserNotifications);

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestDeleteAllAlerts = createAction(AuthenticationActions.RequestDeleteAllAlerts);

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestMarkAllAlertsAsRead = createAction(AuthenticationActions.RequestMarkAsReadAllAlerts);

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestDeleteAlert = createAction(AuthenticationActions.RequestDeleteAlert, (alertId: string) => ({ alertId }));

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestAlertMarkedAsRead = createAction(AuthenticationActions.RequestMarkAsReadAlert, (alertId: string) => ({ alertId }));

// eslint-disable-next-line @typescript-eslint/typedef
export const ResetUserData = createAction(AuthenticationActions.ResetUserData);

// eslint-disable-next-line @typescript-eslint/typedef
export const SetNewUserImage = createAction(AuthenticationActions.SetNewUserImage, props<{ profileImage: string }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const SetUserData = createAction(AuthenticationActions.SetUserData, props<UserData>());

// eslint-disable-next-line @typescript-eslint/typedef
export const SetUserAuthenticated = createAction(AuthenticationActions.SetUserAuthenticated, props<{ authenticated: boolean }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const SetUserNotifications = createAction(AuthenticationActions.SetUserNotifications, props<{ notifications: Array<Notification> }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const UpdateUserData = createAction(AuthenticationActions.UpdateUserData, props<UserData>());

// eslint-disable-next-line @typescript-eslint/typedef
export const UpdateAlert = createAction(AuthenticationActions.UpdateAlert, (alertId: string) => ({ alertId }));

// eslint-disable-next-line @typescript-eslint/typedef
export const UpdateAllAlerts = createAction(AuthenticationActions.UpdateAlerts);

// eslint-disable-next-line @typescript-eslint/typedef
export const RemoveAlert = createAction(AuthenticationActions.RemoveAlert, (alertId: string) => ({ alertId }));

// eslint-disable-next-line @typescript-eslint/typedef
export const RemoveAllAlerts = createAction(AuthenticationActions.RemoveAllAlerts);
