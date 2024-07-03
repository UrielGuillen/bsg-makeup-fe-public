import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { AppointmentResponse, Appointments } from '../interfaces/appointments.interface';
import { CreateAppointmentResponse } from '../interfaces/create-appointment.interface';
import { FeedbackRequestResponse } from '../interfaces/feedback-request.interface';
import { MOCK_APPOINTMENTS_LIST } from '../mocks/mock-appointments-list';
import { FeedbackStatus } from '../enums/feedback-status.enum';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { ManualUsersResponse } from '../interfaces/manual-users-response.interface';

import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AppointmentsService ],
    });

    service = TestBed.inject(AppointmentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an appointment', () => {
    const fakeAppointment: Partial<Appointments> = {
      id: '1',
      time: '08:00',
    };

    service.createAppointment(fakeAppointment)
      .subscribe((response: CreateAppointmentResponse) => {
        expect(response.success).toBeTruthy();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/create-appointment');

    expect(request.request.method).toBe('POST');

    request.flush({ success: true, message: 'Appointment created successfully' });
  });

  it('should create an admin appointment', () => {
    const fakeAppointment: Partial<Appointments> = {
      id: '2',
      time: '10:00',
    };

    service.createManualAppointment(fakeAppointment)
      .subscribe((response: CreateAppointmentResponse) => {
        expect(response.success).toBeTruthy();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/create-manual-appointment');

    expect(request.request.method).toBe('POST');

    request.flush({ success: true, message: 'Appointment created successfully' });
  });

  it('should send the feedback request', () => {
    service.createFeedbackRequest('1')
      .subscribe((response: FeedbackRequestResponse) => {
        expect(response.success).toBeTruthy();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/request-feedback');

    expect(request.request.method).toBe('POST');

    request.flush({ success: true, message: 'Feedback request created successfully' });
  });

  it('should reject the feedback', () => {
    service.rejectFeedback('1')
      .subscribe((response: FeedbackRequestResponse) => {
        expect(response.success).toBeTruthy();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/reject-feedback');

    expect(request.request.method).toBe('PUT');

    request.flush({ success: true, message: 'Feedback rejected successfully' });
  });

  it('should complete the feedback', () => {
    service.completeAppointment('1')
      .subscribe((response: FeedbackRequestResponse) => {
        expect(response.success).toBeTruthy();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/complete');

    expect(request.request.method).toBe('PUT');

    request.flush({ success: true, message: 'Feedback rejected successfully' });
  });

  it('should save the feedback of an appointment', () => {
    const fakeAppointment: Appointments = {
      ...MOCK_APPOINTMENTS_LIST[0],
      feedbackStatus: FeedbackStatus.Created,
      feedback: 'Some nice feedback',
    };

    service.saveFeedback(fakeAppointment)
      .subscribe((response: FeedbackRequestResponse) => {
        expect(response.success).toBeTruthy();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/save-feedback');

    expect(request.request.method).toBe('PUT');

    request.flush({ success: true, message: 'Feedback saved successfully' });
  });

  it('should get all scheduled appointments', () => {
    service.getAllAppointments('01-01-2023')
      .subscribe((response: Array<Appointments>) => {
        expect(response.length).toBeGreaterThan(0);
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/get-appointments?scheduledDate=01-01-2023');

    expect(request.request.method).toBe('GET');

    request.flush({
      success: true,
      message: 'Appointments retrieved successfully',
      response: MOCK_APPOINTMENTS_LIST,
    });
  });

  it('should get all user scheduled appointments', () => {
    service.getAppointmentsByUser()
      .subscribe((response: Array<Appointments>) => {
        expect(response.length).toBeGreaterThan(0);
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/get-user-appointments');

    expect(request.request.method).toBe('GET');

    request.flush({
      success: true,
      message: 'User appointments retrieved successfully',
      response: MOCK_APPOINTMENTS_LIST,
    });
  });

  it('should update appointment status', (done: DoneFn) => {
    service.updateAppointmentStatus({ appointmentId: '1', status: AppointmentStatus.Rejected })
      .subscribe((response: AppointmentResponse) => {
        expect(response.response).not.toBeNull();
        expect(response.response?.status).toBe(AppointmentStatus.Rejected);
        done();
      });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/appointment/update-status');

    expect(request.request.method).toBe('PUT');

    const mockResponse: AppointmentResponse = {
      success: true,
      message: 'udpated from test',
      response: {
        ...MOCK_APPOINTMENTS_LIST[0],
        status: AppointmentStatus.Rejected,
      },
    };

    request.flush(mockResponse);
  });

  it('should get the users created by the admin', (done: DoneFn) => {
    service.getManualUsersList().subscribe((response: ManualUsersResponse) => {
      expect(response.success).toBeTruthy();
      done();
    });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/manual-users');

    expect(request.request.method).toBe('GET');

    const mockResponse: ManualUsersResponse = {
      success: true,
      message: 'get user list',
      response: [],
    };

    request.flush(mockResponse);
  });
});
