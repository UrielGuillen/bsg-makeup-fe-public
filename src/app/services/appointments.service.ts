import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, take } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreateAppointment, CreateAppointmentResponse, CreateManualAppointment } from '../interfaces/create-appointment.interface';
import { AppointmentResponse, Appointments, AppointmentsResponse } from '../interfaces/appointments.interface';
import { FeedbackRequestResponse } from '../interfaces/feedback-request.interface';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { ManualUsersResponse } from '../interfaces/manual-users-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly prefixUrl: string = environment.api.url;
  private readonly appointmentUrl: string = this.prefixUrl + '/appointment';

  constructor(protected http: HttpClient) {}

  public createAppointment(body: Partial<CreateAppointment>): Observable<CreateAppointmentResponse> {
    const createAppointmentUrl: string = this.appointmentUrl + '/create-appointment';

    return this.http.post<CreateAppointmentResponse>(createAppointmentUrl, body).pipe(take(1));
  }

  public createManualAppointment(body: Partial<CreateManualAppointment>): Observable<CreateAppointmentResponse> {
    const createManualAppointmentUrl: string = this.appointmentUrl + '/create-manual-appointment';

    return this.http.post<CreateAppointmentResponse>(createManualAppointmentUrl, body).pipe(take(1));
  }

  public createFeedbackRequest(appointmentId: string): Observable<FeedbackRequestResponse> {
    const createFeedbackUrl: string = this.appointmentUrl + '/request-feedback';

    return this.http.post<FeedbackRequestResponse>(createFeedbackUrl, appointmentId).pipe(take(1));
  }

  public rejectFeedback(appointmentId: string): Observable<FeedbackRequestResponse> {
    const createFeedbackUrl: string = this.appointmentUrl + '/reject-feedback';

    return this.http.put<FeedbackRequestResponse>(createFeedbackUrl, appointmentId).pipe(take(1));
  }

  public saveFeedback(appointment: Appointments): Observable<FeedbackRequestResponse> {
    const saveFeedbackUrl: string = this.appointmentUrl + '/save-feedback';

    return this.http
      .put<FeedbackRequestResponse>(saveFeedbackUrl, {
        appointmentId: appointment.id,
        feedback: appointment.tempFeedback,
      })
      .pipe(take(1));
  }

  public completeAppointment(appointmentId: string): Observable<FeedbackRequestResponse> {
    const saveFeedbackUrl: string = this.appointmentUrl + '/complete';

    return this.http.put<FeedbackRequestResponse>(saveFeedbackUrl, appointmentId).pipe(take(1));
  }

  public updateAppointmentStatus(body: { appointmentId: string, status: AppointmentStatus }): Observable<AppointmentResponse> {
    const updateStatusUrl: string = this.appointmentUrl + '/update-status';

    return this.http.put<AppointmentResponse>(updateStatusUrl, body).pipe(take(1));
  }

  public getAllAppointments(scheduledDate: string): Observable<Array<Appointments>> {
    let getAllAppointmentsUrl: string = this.appointmentUrl + '/get-appointments?';
    getAllAppointmentsUrl += 'scheduledDate=' + scheduledDate;

    return this.http.get<AppointmentsResponse>(getAllAppointmentsUrl).pipe(
      take(1),
      map((response: AppointmentsResponse) => response.response),
    );
  }

  public getManualUsersList(): Observable<ManualUsersResponse> {
    const manualUsersUrl: string = this.prefixUrl + '/manual-users';

    return this.http.get<ManualUsersResponse>(manualUsersUrl).pipe(take(1));
  }

  public getAppointmentsByUser(): Observable<Array<Appointments>> {
    const getAppointmentsByUserUrl: string = this.appointmentUrl + '/get-user-appointments';

    return this.http.get<AppointmentsResponse>(getAppointmentsByUserUrl).pipe(
      take(1),
      map((response: AppointmentsResponse) => this.sortAppointmentsByDate(response.response)),
      map((appointments: Array<Appointments>) => {
        return appointments.map((appointment: Appointments) => {
          return { ...appointment, tempFeedback: '' };
        });
      }),
    );
  }

  private sortAppointmentsByDate(appointments: Array<Appointments>): Array<Appointments> {
    return appointments.sort(
      (firstElement: Appointments, nextElement: Appointments) =>
        new Date(nextElement.scheduledDate).getTime() - new Date(firstElement.scheduledDate).getTime(),
    );
  }
}
