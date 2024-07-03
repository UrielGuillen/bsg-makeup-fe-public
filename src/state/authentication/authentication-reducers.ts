import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import { UserState } from '../state.model';
import { UserData } from '../../app/interfaces/user-data.interface';
import { Notification } from '../../app/interfaces/notifications.interface';

import * as AuthenticationActions from './authentication-actions';

const INITIAL_STATE: UserState = {
  isUserAuthenticated: false,
  userData: {} as UserData,
  notifications: [],
};

export const authenticationReducer: ActionReducer<UserState, Action> = createReducer(
  INITIAL_STATE,
  on(AuthenticationActions.SetUserAuthenticated, (state: UserState, payload: { authenticated: boolean }) => ({
    ...state,
    isUserAuthenticated: payload.authenticated,
  })),
  on(AuthenticationActions.SetUserData, (state: UserState, payload: UserData) => ({
    ...state,
    userData: {
      ...payload,
    },
  })),
  on(AuthenticationActions.SetNewUserImage, (state: UserState, payload: { profileImage: string }) => ({
    ...state,
    userData: {
      ...state.userData,
      profileUrl: payload.profileImage,
    },
  })),
  on(AuthenticationActions.ResetUserData, () => ({ ...INITIAL_STATE })),
  on(AuthenticationActions.UpdateUserData, (state: UserState, payload: UserData) => ({
    ...state,
    userData: {
      ...payload,
      name: payload.name,
      lastName: payload.lastName,
      email: payload.email,
    },
  })),
  on(AuthenticationActions.SetUserNotifications, (state: UserState, payload: { notifications: Array<Notification> }) => ({
    ...state,
    notifications: payload.notifications,
  })),
  on(AuthenticationActions.UpdateAlert, (state: UserState, payload: { alertId: string }) => {
    const updatedNotifications: Array<Notification> = [ ...state.notifications ];
    const notificationIndex: number = updatedNotifications.findIndex((notification: Notification) => notification.id === payload.alertId);

    updatedNotifications[notificationIndex] = {
      ...updatedNotifications[notificationIndex],
      hasBeenRead: true,
    };

    return {
      ...state,
      notifications: updatedNotifications,
    };
  }),
  on(AuthenticationActions.UpdateAllAlerts, (state: UserState) => {
    const updatedNotifications: Array<Notification> = [ ...state.notifications ].map((notification: Notification) => {
      return {
        ...notification,
        hasBeenRead: true,
      };
    });

    return {
      ...state,
      notifications: updatedNotifications,
    };
  }),
  on(AuthenticationActions.RemoveAlert, (state: UserState, payload: { alertId: string }) => {
    const updatedNotifications: Array<Notification> = [ ...state.notifications ]
      .filter((notification: Notification) => notification.id !== payload.alertId);

    return {
      ...state,
      notifications: updatedNotifications,
    };
  }),
  on(AuthenticationActions.RemoveAllAlerts, (state: UserState) => ({
    ...state,
    notifications: [],
  })),
);
