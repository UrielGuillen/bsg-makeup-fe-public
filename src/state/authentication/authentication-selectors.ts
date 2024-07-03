import { createSelector } from '@ngrx/store';

import { AppState, UserState } from '../state.model';

// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
const state = (state: AppState) => state.authenticationState;

// eslint-disable-next-line @typescript-eslint/typedef
export const getUserData = createSelector(state, (state: UserState) => state.userData);

// eslint-disable-next-line @typescript-eslint/typedef
export const getUserNotifications = createSelector(state, (state: UserState) => state.notifications);

// eslint-disable-next-line @typescript-eslint/typedef
export const getUserProfileImage = createSelector(state, (state: UserState) => state.userData.profileUrl);

// eslint-disable-next-line @typescript-eslint/typedef
export const isUserAuthenticated = createSelector(state, (state: UserState) => state.isUserAuthenticated);

// eslint-disable-next-line @typescript-eslint/typedef
export const isSessionOpened = createSelector(state, () => localStorage.getItem('Authorization') !== null);
