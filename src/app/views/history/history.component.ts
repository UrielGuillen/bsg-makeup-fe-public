import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppointmentsService } from '../../services/appointments.service';
import { Appointments } from '../../interfaces/appointments.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { AppointmentStatus } from '../../enums/appointment-status.enum';
import { FeedbackRequestResponse } from '../../interfaces/feedback-request.interface';
import { NotificationService } from '../../services/core/notification.service';
import { FeedbackStatus } from '../../enums/feedback-status.enum';
import { AppState } from '../../../state/state.model';
import { getUserAppointments } from '../../../state/appointments/appointments-selectors';
import { LoadUserScheduledAppointments } from '../../../state/appointments/appointments-actions';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: [ './history.component.scss' ],
})
export class HistoryComponent implements OnInit, OnDestroy {
  public appointmentsList$!: Observable<Array<Appointments>>;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private store$: Store<AppState>,
    private appointmentsService: AppointmentsService,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.initUserAppointmentsHistoryListener();
    this.getAppointmentsList();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public trackByAppointmentId(index: number, appointment: Appointments): string {
    return appointment.id;
  }

  public isUserAllowed(status: AppointmentStatus): boolean {
    return !this.authService.isTypeUser() && status !== AppointmentStatus.Completed;
  }

  public canValidateFeedback(appointment: Appointments): boolean {
    return appointment.feedbackStatus === FeedbackStatus.Created && appointment.feedback !== null && appointment.feedback !== '';
  }

  public canSeeUserData(): boolean {
    return !this.authService.isTypeUser();
  }

  public canSendFeedback(): boolean {
    return this.authService.isTypeUser();
  }

  public requestFeedback(appointmentId: string): void {
    this.subscriptions.push(
      this.appointmentsService.createFeedbackRequest(appointmentId).subscribe((response: FeedbackRequestResponse) => this.handleResponse(response)),
    );
  }

  public rejectFeedback(appointmentId: string): void {
    this.subscriptions.push(
      this.appointmentsService.rejectFeedback(appointmentId).subscribe((response: FeedbackRequestResponse) => this.handleResponse(response)),
    );
  }

  public saveFeedback(appointment: Appointments): void {
    this.subscriptions.push(
      this.appointmentsService.saveFeedback(appointment).subscribe((response: FeedbackRequestResponse) => this.handleResponse(response)),
    );
  }

  public completeAppointment(appointmentId: string): void {
    this.subscriptions.push(
      this.appointmentsService.completeAppointment(appointmentId).subscribe((response: FeedbackRequestResponse) => this.handleResponse(response)),
    );
  }

  private handleResponse(response: FeedbackRequestResponse): void {
    if (response.success && response.response.id) {
      this.initUserAppointmentsHistoryListener();
      this.notificationService.showToast({
        message: response.message,
        type: 'success',
      });
    }
  }

  private initUserAppointmentsHistoryListener(): void {
    this.store$.dispatch(LoadUserScheduledAppointments());
  }

  private getAppointmentsList(): void {
    this.appointmentsList$ = this.store$.select(getUserAppointments);
  }
}
