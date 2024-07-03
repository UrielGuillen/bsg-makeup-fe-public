import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { MOCK_APPOINTMENTS_LIST } from '../../mocks/mock-appointments-list';
import { AppointmentStatus } from '../../enums/appointment-status.enum';

import { AppointmentDetailComponent } from './appointment-detail.component';

describe('AppointmentDetailComponent', () => {
  let component: AppointmentDetailComponent;
  let fixture: ComponentFixture<AppointmentDetailComponent>;
  // eslint-disable-next-line @typescript-eslint/typedef
  const mockMatDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppointmentDetailComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { data: MOCK_APPOINTMENTS_LIST[0] } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentDetailComponent);
    component = fixture.componentInstance;
    component.appointment = MOCK_APPOINTMENTS_LIST[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all possible icons for the appointment status', () => {
    expect(component.getAppointmentStatusIcon(AppointmentStatus.Confirmed)).toBe('event_available');
    expect(component.getAppointmentStatusIcon(AppointmentStatus.Rejected)).toBe('event_busy');
    expect(component.getAppointmentStatusIcon(AppointmentStatus.Feedback)).toBe('schedule');
    expect(component.getAppointmentStatusIcon(AppointmentStatus.Completed)).toBe('done_all');
    expect(component.getAppointmentStatusIcon(AppointmentStatus.Invalid)).toBe('info');
  });

  it('should return all possible text for the appointment status', () => {
    expect(component.getAppointmentStatusText(AppointmentStatus.Confirmed)).toBe('APPOINTMENT_DETAILS.CONFIRMED');
    expect(component.getAppointmentStatusText(AppointmentStatus.Rejected)).toBe('APPOINTMENT_DETAILS.REJECTED');
    expect(component.getAppointmentStatusText(AppointmentStatus.Feedback)).toBe('APPOINTMENT_DETAILS.FEEDBACK');
    expect(component.getAppointmentStatusText(AppointmentStatus.Completed)).toBe('APPOINTMENT_DETAILS.COMPLETED');
    expect(component.getAppointmentStatusText(AppointmentStatus.Invalid)).toBe('APPOINTMENT_DETAILS.PENDING');
  });

  it('should close the mat dialog with the status in the call', () => {
    component.closeAppointmentDetail(AppointmentStatus.Confirmed);

    fixture.detectChanges();

    expect(mockMatDialogRef.close).toHaveBeenCalledWith(AppointmentStatus.Confirmed);
  });
});
