import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
  formatScheduledDate,
  getAvailableHours,
  getCurrentDay,
  getDayName,
  getMonthName,
  moveOneDayBack,
  moveOneDayForward,
} from '../../utils/date.utils';
import { Appointments } from '../../interfaces/appointments.interface';
import { Agenda } from '../../interfaces/agenda-interface';
import { AppState } from '../../../state/state.model';
import { getScheduledAppointments } from '../../../state/appointments/appointments-selectors';
import {
  LoadScheduledAppointments,
  SetHourSelected,
  SetSelectedDate, UpdateAppointmentStatus,
} from '../../../state/appointments/appointments-actions';
import { AppointmentDetailComponent } from '../../components/appointment-detail/appointment-detail.component';
import { AppointmentStatus } from '../../enums/appointment-status.enum';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: [ './agenda.component.scss' ],
})
export class AgendaComponent implements OnInit, OnDestroy {
  public currentDate: Date = new Date();
  public availableHours: Array<Agenda> = getAvailableHours();
  public appointmentsList: Array<Appointments> = [];

  public currentDay!: number;
  public dayName!: string;
  public monthName!: string;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private store$: Store<AppState>,
    private router: Router,
    private dialog: MatDialog,
    public authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.setDatesData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public trackByHourId(index: number, item: Agenda): number {
    return item.id;
  }

  public trackByAppointmentId(index: number, item: Appointments): string {
    return item.id;
  }

  public goToSchedule(hourRow: Agenda): void {
    this.store$.dispatch(SetHourSelected({ hour: hourRow }));

    this.router.navigate([ '/', 'schedule' ]);
  }

  public moveOneDayForward(): void {
    this.currentDate = moveOneDayForward(this.currentDate);
    this.setDatesData();
  }

  public moveOneDayBack(): void {
    this.currentDate = moveOneDayBack(this.currentDate);
    this.setDatesData();
  }

  public resetCalendar(): void {
    this.currentDate = new Date();
    this.setDatesData();
  }

  public openAppointmentDetails(appointment: Appointments): void {
    const dialogRef: MatDialogRef<AppointmentDetailComponent> = this.dialog.open(AppointmentDetailComponent, {
      data: appointment,
      disableClose: true,
      autoFocus: false,
      height: '500px',
    });

    const tempSubscription: Subscription = dialogRef.afterClosed().subscribe((status: AppointmentStatus) => {

      if (status !== AppointmentStatus.Invalid) {
        this.store$.dispatch(UpdateAppointmentStatus({
          appointmentId: appointment.id,
          status: status,
        }));
      }

      tempSubscription.unsubscribe();
    });
  }

  private setDatesData(): void {
    this.updateState();
    this.getCurrentDay();
    this.getDayName();
    this.getMonthName();
    this.getAppointmentsData();
  }

  private updateState(): void {
    this.store$.dispatch(SetSelectedDate({ selectedDate: formatScheduledDate(this.currentDate) }));
    this.store$.dispatch(LoadScheduledAppointments());
  }

  private getCurrentDay(): void {
    this.currentDay = getCurrentDay(this.currentDate);
  }

  private getDayName(): void {
    this.dayName = getDayName(this.currentDate);
  }

  private getMonthName(): void {
    this.monthName = getMonthName(this.currentDate);
  }

  private getAppointmentsData(): void {
    this.subscriptions.push(
      this.store$.select(getScheduledAppointments).subscribe((appointments: Array<Appointments>) => (this.appointmentsList = appointments)),
    );
  }
}
