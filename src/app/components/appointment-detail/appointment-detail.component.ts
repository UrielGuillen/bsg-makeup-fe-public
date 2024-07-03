import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Appointments } from '../../interfaces/appointments.interface';
import { SharedModule } from '../../modules/shared.module';
import { AppointmentStatus } from '../../enums/appointment-status.enum';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.scss',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatIcon,
    CurrencyPipe,
    DatePipe,
    NgIf,
    TranslateModule,
    SharedModule,
    NgClass,
  ],
})
export class AppointmentDetailComponent {

  constructor(
    private dialogRef: MatDialogRef<AppointmentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public appointment: Appointments) {}

  public closeAppointmentDetail(status: AppointmentStatus): void {
    this.dialogRef.close(status);
  }

  public getAppointmentStatusIcon(status: AppointmentStatus): string {
    switch (status) {
    case AppointmentStatus.Created:
      return 'add';
    case AppointmentStatus.Confirmed:
      return 'event_available';
    case AppointmentStatus.Rejected:
      return 'event_busy';
    case AppointmentStatus.Feedback:
      return 'schedule';
    case AppointmentStatus.Completed:
      return 'done_all';
    default:
      return 'info';
    }
  }

  public getAppointmentStatusText(status: AppointmentStatus): string {
    switch (status) {
    case AppointmentStatus.Created:
      return 'APPOINTMENT_DETAILS.CREATED';
    case AppointmentStatus.Confirmed:
      return 'APPOINTMENT_DETAILS.CONFIRMED';
    case AppointmentStatus.Rejected:
      return 'APPOINTMENT_DETAILS.REJECTED';
    case AppointmentStatus.Feedback:
      return 'APPOINTMENT_DETAILS.FEEDBACK';
    case AppointmentStatus.Completed:
      return 'APPOINTMENT_DETAILS.COMPLETED';
    default:
      return 'APPOINTMENT_DETAILS.PENDING';
    }
  }
}
