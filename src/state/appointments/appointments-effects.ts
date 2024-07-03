import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { catchError, map, switchMap, take, tap } from 'rxjs';
import { Router } from '@angular/router';

import { AppointmentsService } from '../../app/services/appointments.service';
import { AppState } from '../state.model';
import { LoadingStatus } from '../../app/enums/loading-status.enum';
import { AppointmentResponse, Appointments } from '../../app/interfaces/appointments.interface';
import { SetLoadingStatus } from '../configuration/configuration-actions';
import {
  CreateAppointment,
  CreateAppointmentResponse,
  CreateManualAppointment,
} from '../../app/interfaces/create-appointment.interface';
import { AppointmentStatus } from '../../app/enums/appointment-status.enum';
import { NotificationService } from '../../app/services/core/notification.service';
import { ManualUsersResponse } from '../../app/interfaces/manual-users-response.interface';

import { getSelectedDate } from './appointments-selectors';
import * as AppointmentsActions from './appointments-actions';

@Injectable()
export class AppointmentsEffects {
  // eslint-disable-next-line @typescript-eslint/typedef
  getScheduledAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.LoadScheduledAppointments),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap(() => this.store$.select(getSelectedDate).pipe(take(1))),
      switchMap((selectedDate: string) => this.appointmentsService.getAllAppointments(selectedDate)),
      map((scheduledAppointments: Array<Appointments>) => {
        this.store$.dispatch(
          AppointmentsActions.SetScheduledAppointments({
            appointments: scheduledAppointments,
          }),
        );

        this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.Completed }));
      }),
      catchError((_, caught) => {
        this.store$.dispatch(this.getErrorStatusAction());

        return caught;
      }),
    ),
  { dispatch: false },
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  getUserScheduledAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.LoadUserScheduledAppointments),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap(() => this.appointmentsService.getAppointmentsByUser()),
      map((historyUserAppointments: Array<Appointments>) => {
        this.store$.dispatch(
          AppointmentsActions.SetHistoryUserAppointments({
            appointments: historyUserAppointments,
          }),
        );

        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
      catchError((_, caught) => {
        this.store$.dispatch(this.getErrorStatusAction());

        return caught;
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  createUserAppointment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.CreateUserAppointment),
        tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
        switchMap((payload: { appointment: Partial<CreateAppointment> }) => this.appointmentsService.createAppointment(payload.appointment)),
        map((response: CreateAppointmentResponse) => {
          if (!response.success) {
            return this.getErrorStatusAction();
          }

          this.store$.dispatch(AppointmentsActions.SetNewAppointment(response.response));
          this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.Completed }));

          return this.router.navigate([ '/', 'agenda' ]);
        }),
        catchError((_, caught) => {
          this.store$.dispatch(this.getErrorStatusAction());

          return caught;
        }),
      ),
    { dispatch: false },
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  createAdminAppointment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.CreateAdminAppointment),
        tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
        switchMap((payload: { appointment: Partial<CreateManualAppointment> }) =>
          this.appointmentsService.createManualAppointment(payload.appointment),
        ),
        map((response: CreateAppointmentResponse) => {
          if (!response.success) {
            return this.getErrorStatusAction();
          }

          this.store$.dispatch(AppointmentsActions.SetNewAppointment(response.response));
          this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.Completed }));

          return this.router.navigate([ '/', 'agenda' ]);
        }),
        catchError((_, caught) => {
          this.store$.dispatch(this.getErrorStatusAction());

          return caught;
        }),
      ),
    { dispatch: false },
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  updateAppointmentStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.UpdateAppointmentStatus),
      tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap((payload: { appointmentId: string, status: AppointmentStatus }) =>
        this.appointmentsService.updateAppointmentStatus(payload),
      ),
      map((response: AppointmentResponse) => {
        if (!response.success || response.response === null) {
          return this.getErrorStatusAction();
        }

        this.notificationService.showNotification({
          title: response.response.status === AppointmentStatus.Confirmed ? 'ALERTS.TITLES.SUCCESS' : 'ALERTS.TITLES.WARNING',
          type: response.response.status === AppointmentStatus.Confirmed ? 'success' : 'warning',
          message: response.message,
        });
        this.store$.dispatch(AppointmentsActions.UpdateAppointment(response.response));
        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
      catchError((_, caught) => {
        this.store$.dispatch(this.getErrorStatusAction());

        return caught;
      }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  getManualUsersList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.RequestManualUsersList),
        tap(() => this.store$.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
        switchMap(() => this.appointmentsService.getManualUsersList()),
        map((response: ManualUsersResponse) => {
          if (!response.success) {
            return this.getErrorStatusAction();
          }

          this.store$.dispatch(AppointmentsActions.SetManualUsersList({ users: response.response }));
          return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
        }),
        catchError((_, caught) => {
          this.store$.dispatch(this.getErrorStatusAction());

          return caught;
        }),
      ),
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private router: Router,
    private appointmentsService: AppointmentsService,
    private notificationService: NotificationService,
  ) {}

  private getErrorStatusAction(): Action {
    return SetLoadingStatus({ loadingStatus: LoadingStatus.Error });
  }
}
