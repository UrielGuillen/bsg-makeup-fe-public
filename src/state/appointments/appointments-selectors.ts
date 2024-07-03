import { createSelector } from '@ngrx/store';

import { AppState, AppointmentsState } from '../state.model';

// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
const state = (state: AppState) => state.appointmentsState;

// eslint-disable-next-line @typescript-eslint/typedef
export const getSelectedDate = createSelector(state, (state: AppointmentsState) => state.selectedDate);

// eslint-disable-next-line @typescript-eslint/typedef
export const getScheduledAppointments = createSelector(state, (state: AppointmentsState) => state.scheduledAppointments);

// eslint-disable-next-line @typescript-eslint/typedef
export const getUserAppointments = createSelector(state, (state: AppointmentsState) => state.historyUserAppointments);

// eslint-disable-next-line @typescript-eslint/typedef
export const getHourSelected = createSelector(state, (state: AppointmentsState) => state.hourSelected);

// eslint-disable-next-line @typescript-eslint/typedef
export const getManualUsers = createSelector(state, (state: AppointmentsState) => state.manualUsers);
