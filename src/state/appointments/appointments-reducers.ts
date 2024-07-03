import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import { AppointmentsState } from '../state.model';
import { Appointments } from '../../app/interfaces/appointments.interface';
import { calculateAppointmentHeight, calculateTimePosition, formatScheduledDate } from '../../app/utils/date.utils';
import { Agenda } from '../../app/interfaces/agenda-interface';
import { ManualUsers } from '../../app/interfaces/manual-users-response.interface';

import * as AppointmentsActions from './appointments-actions';

const INITIAL_STATE: AppointmentsState = {
  selectedDate: formatScheduledDate(new Date()),
  hourSelected: {
    id: 0,
    hour: '',
  } as Agenda,
  scheduledAppointments: [],
  historyUserAppointments: [],
  manualUsers: [],
};

export const appointmentsReducer: ActionReducer<AppointmentsState, Action> = createReducer(
  INITIAL_STATE,
  on(AppointmentsActions.SetSelectedDate, (state: AppointmentsState, payload: { selectedDate: string }) => ({
    ...state,
    selectedDate: payload.selectedDate,
  })),
  on(AppointmentsActions.SetScheduledAppointments, (state: AppointmentsState, payload: { appointments: Array<Appointments> }) => {
    const appointments: Array<Appointments> = [ ...payload.appointments ];
    const appointmentsOrdered: Array<Appointments> = appointments.sort((current: Appointments, nextAppointment: Appointments) =>
      current.time.localeCompare(nextAppointment.time),
    ).map((appointment: Appointments) => {
      return {
        ...appointment,
        topPosition: calculateTimePosition(appointment.time),
        containerHeight: calculateAppointmentHeight(appointment.serviceTime),
      };
    });

    return {
      ...state,
      scheduledAppointments: appointmentsOrdered,
    };
  }),
  on(AppointmentsActions.SetHistoryUserAppointments, (state: AppointmentsState, payload: { appointments: Array<Appointments> }) => ({
    ...state,
    historyUserAppointments: payload.appointments,
  })),
  on(AppointmentsActions.SetHourSelected, (state: AppointmentsState, payload: { hour: Agenda }) => ({
    ...state,
    hourSelected: payload.hour,
  })),
  on(AppointmentsActions.ResetUserAppointments, (state: AppointmentsState) => ({ ...state, historyUserAppointments: [] })),
  on(AppointmentsActions.UpdateAppointment, (state: AppointmentsState, payload: Appointments) => {
    // spread added to avoid mutating the state directly
    const updatedAppointments: Array<Appointments> = [ ...state.scheduledAppointments ];
    const appointmentIndex: number = updatedAppointments.findIndex((appointment: Appointments) => appointment.id === payload.id);

    updatedAppointments[appointmentIndex] = {
      ...updatedAppointments[appointmentIndex],
      status: payload.status,
    };

    return {
      ...state,
      scheduledAppointments: updatedAppointments,
    };
  }),
  on(AppointmentsActions.SetManualUsersList, (state: AppointmentsState, payload: { users: Array<ManualUsers> }) => ({
    ...state,
    manualUsers: payload.users,
  })),
  // TODO: I need to update the back end to return me a full Appointment interface <Appointment> instead of <CreateAppointment>
  //on(AppointmentsActions.SetNewAppointment, (state: AppointmentsState, payload: CreateAppointment) => ({}))
);
