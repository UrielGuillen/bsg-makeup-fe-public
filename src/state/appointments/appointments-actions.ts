import { createAction, props } from '@ngrx/store';

import { Appointments } from '../../app/interfaces/appointments.interface';
import { CreateAppointment, CreateManualAppointment } from '../../app/interfaces/create-appointment.interface';
import { Agenda } from '../../app/interfaces/agenda-interface';
import { AppointmentStatus } from '../../app/enums/appointment-status.enum';
import { ManualUsers } from '../../app/interfaces/manual-users-response.interface';

enum AppointmentsActions {
  LoadAppointmentsData = '[Request] Request appointments data',
  LoadUserAppointmentsData = '[Request] Request user appointments data',
  ResetUserAppointments = '[Reset] Reset user appointments',
  SetSelectedDate = '[Set] Set selected date',
  SetScheduledAppointments = '[Set] Set scheduled appointments',
  SetHistoryUserAppointments = '[Set] Set history user appointments',
  SetNewAppointment = '[Set] Set new appointment',
  SetHourSelected = '[Set] Set hour selected',
  CreateUserAppointment = '[Create] Create user appointment',
  CreateAdminAppointment = '[Create] Create admin appointment',
  UpdateAppointmentStatus = '[Update] Update appointment status',
  UpdateAppointment = '[Update] Update appointment',
  RequestManualUsersList = '[Request] Request manual users list',
  SetManualUsersList = '[Set] Set manual users list'
}

// eslint-disable-next-line @typescript-eslint/typedef
export const LoadScheduledAppointments = createAction(AppointmentsActions.LoadAppointmentsData);

// eslint-disable-next-line @typescript-eslint/typedef
export const LoadUserScheduledAppointments = createAction(AppointmentsActions.LoadUserAppointmentsData);

// eslint-disable-next-line @typescript-eslint/typedef
export const ResetUserAppointments = createAction(AppointmentsActions.ResetUserAppointments);

// eslint-disable-next-line @typescript-eslint/typedef
export const SetSelectedDate = createAction(AppointmentsActions.SetSelectedDate, props<{ selectedDate: string }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const SetScheduledAppointments = createAction(AppointmentsActions.SetScheduledAppointments, props<{ appointments: Array<Appointments> }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const SetHistoryUserAppointments = createAction(
  AppointmentsActions.SetHistoryUserAppointments,
  props<{ appointments: Array<Appointments> }>(),
);

// eslint-disable-next-line @typescript-eslint/typedef
export const SetNewAppointment = createAction(AppointmentsActions.SetNewAppointment, props<CreateAppointment>());

// eslint-disable-next-line @typescript-eslint/typedef
export const SetHourSelected = createAction(AppointmentsActions.SetHourSelected, props<{ hour: Agenda }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const CreateUserAppointment = createAction(AppointmentsActions.CreateUserAppointment, props<{ appointment: Partial<CreateAppointment> }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const CreateAdminAppointment = createAction(
  AppointmentsActions.CreateAdminAppointment,
  props<{ appointment: Partial<CreateManualAppointment> }>(),
);

// eslint-disable-next-line @typescript-eslint/typedef
export const UpdateAppointmentStatus = createAction(
  AppointmentsActions.UpdateAppointmentStatus,
  props<{ appointmentId: string, status: AppointmentStatus }>(),
);

// eslint-disable-next-line @typescript-eslint/typedef
export const UpdateAppointment = createAction(AppointmentsActions.UpdateAppointment, props<Appointments>());

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestManualUsersList = createAction(AppointmentsActions.RequestManualUsersList);

// eslint-disable-next-line @typescript-eslint/typedef
export const SetManualUsersList = createAction(AppointmentsActions.SetManualUsersList, props<{ users: Array<ManualUsers>}>());
