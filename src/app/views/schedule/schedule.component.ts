import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SweetAlertIcon } from 'sweetalert2';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';

import { ServicesCatalog } from '../../interfaces/services-catalog.interface';
import { NotificationService } from '../../services/core/notification.service';
import { CreateAppointment, CreateManualAppointment } from '../../interfaces/create-appointment.interface';
import { Appointments } from '../../interfaces/appointments.interface';
import { formatScheduledDate, getServiceEndTimeAvailable, getUnavailableHours } from '../../utils/date.utils';
import { ScheduleData } from '../../interfaces/schedule-data.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { AppState } from '../../../state/state.model';
import { getServicesList } from '../../../state/configuration/configuration-selectors';
import {
  getHourSelected,
  getManualUsers,
  getScheduledAppointments,
  getSelectedDate,
} from '../../../state/appointments/appointments-selectors';
import { CreateAdminAppointment, CreateUserAppointment } from '../../../state/appointments/appointments-actions';
import { Agenda } from '../../interfaces/agenda-interface';
import { ManualUsers } from '../../interfaces/manual-users-response.interface';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: [ './schedule.component.scss' ],
  providers: [ { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } } ],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  public readonly startEndTime: { start: string; end: string } = {
    start: '08:00',
    end: '21:00',
  };
  public selectedService: ServicesCatalog | undefined = undefined;
  public servicesList: Array<ServicesCatalog> = [];
  public clientDataForm: FormGroup = new FormGroup({});
  public selectDateForm: FormGroup = new FormGroup({});
  public selectServiceForm: FormGroup = new FormGroup({});
  public isUserAllowed: boolean = !this.authService.isTypeUser();
  public manualUsers: Array<ManualUsers> = [];
  public selectedUser!: ManualUsers;

  private scheduleData!: ScheduleData;
  private scheduledAppointments: Array<Appointments> = [];
  private subscriptions: Array<Subscription> = [];

  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private store$: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.initServiceCatalogListener();
    this.initAppointmentsListener();
    this.initScheduledDataListener();
    this.initServiceSelectedListener();
    this.initManualUsersListener();
    this.initUserExistsListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public trackByServiceId(index: number, item: ServicesCatalog): string {
    return item.id;
  }

  public trackByUserId(index: number, item: ManualUsers): string {
    return item.id;
  }

  public validateForm(): void {
    if (this.areFormsValid()) {
      this.createAppointment();
    } else {
      this.sendNotification('SCHEDULE.FORM_ERROR', 'warning');
    }
  }

  public onUserSelected(user: ManualUsers): void {
    this.selectedUser = user;
  }

  private areFormsValid(): boolean {
    return this.selectDateForm.valid && this.selectServiceForm.valid;
  }

  private isHourAvailable(): boolean {
    if (this.scheduledAppointments.length === 0) {
      return true;
    }

    const hourSelected: string = this.selectDateForm.controls['time'].value;
    const unavailableHours: Array<Agenda> = getUnavailableHours(this.scheduledAppointments);
    const isHourAvailable: boolean = unavailableHours.findIndex((unavailableHour: Agenda) => unavailableHour.hour === hourSelected) === -1;
    const isEndTimeAvailable: boolean = unavailableHours.findIndex((unavailableHour: Agenda) => unavailableHour.hour === getServiceEndTimeAvailable(this.selectedService, hourSelected)) === -1;

    return isHourAvailable && isEndTimeAvailable;
  }

  private createAppointment(): void {
    if (this.isHourAvailable()) {
      if (this.isUserAllowed) {
        this.store$.dispatch(CreateAdminAppointment({ appointment: this.getAppointmentPayload() }));
      } else {
        this.store$.dispatch(CreateUserAppointment({ appointment: this.getAppointmentPayload() }));
      }
    } else {
      this.notificationService.showNotification({
        message: 'SCHEDULE.HOUR_UNAVAILABLE',
        type: 'info',
      });
    }
  }

  private getAppointmentPayload(): Partial<CreateAppointment | CreateManualAppointment> {
    const appointment: Partial<CreateAppointment> = {
      scheduledDate: formatScheduledDate(this.selectDateForm.controls['date'].value),
      time: this.selectDateForm.controls['time'].value,
      serviceId: this.selectServiceForm.controls['service'].value,
      userId: '',
    };

    if (this.isUserAllowed) {
      const userExists: boolean = this.clientDataForm.controls['userExists'].value;

      return {
        ...appointment,
        name: this.clientDataForm.controls['name'].value,
        lastName: this.clientDataForm.controls['lastName'].value,
        phone: this.clientDataForm.controls['phone'].value,
        userId: userExists ? this.selectedUser.id : '',
        userExists,
      };
    }

    return appointment;
  }

  private initServiceCatalogListener(): void {
    this.subscriptions.push(
      this.store$.select(getServicesList).subscribe((servicesList: Array<ServicesCatalog>) => (this.servicesList = servicesList)),
    );
  }

  private initAppointmentsListener(): void {
    this.subscriptions.push(
      this.store$
        .select(getScheduledAppointments)
        .subscribe((scheduledAppointments: Array<Appointments>) => (this.scheduledAppointments = scheduledAppointments)),
    );
  }

  private initScheduledDataListener(): void {
    this.subscriptions.push(
      combineLatest([ this.store$.select(getHourSelected), this.store$.select(getSelectedDate) ]).subscribe(
        ([ hourSelected, dateSelected ]: [Agenda, string]) => {
          this.scheduleData = <ScheduleData>{
            hourRowData: hourSelected,
            selectedDate: new Date(dateSelected),
          };

          if (this.scheduleData.hourRowData.id > 0) {
            this.selectDateForm.patchValue({
              date: this.scheduleData.selectedDate,
              time: this.scheduleData.hourRowData.hour,
            });
          }
        },
      ),
    );
  }

  private initForms(): void {
    this.selectDateForm = new FormGroup(
      {
        date: new FormControl({ value: '', disabled: true }, Validators.required),
        time: new FormControl({ value: '', disabled: false }, Validators.required),
      },
      { updateOn: 'change' },
    );

    this.selectServiceForm = new FormGroup({
      service: new FormControl('', Validators.required),
    });

    if (this.isUserAllowed) {
      this.clientDataForm = new FormGroup({
        name: new FormControl({ value: '', disabled: false }),
        lastName: new FormControl({ value: '', disabled: false }),
        phone: new FormControl({ value: '', disabled: false }),
        userSelected: new FormControl({ value: '', disabled: false }),
        userExists: new FormControl({ value: false, disabled: false }),
      });

      this.adjustClientValidations(false);
    }
  }

  private initServiceSelectedListener(): void {
    this.subscriptions.push(
      this.selectServiceForm.controls['service'].valueChanges.subscribe((serviceId: string) => this.setSelectedService(serviceId)),
    );
  }

  private initManualUsersListener(): void {
    this.subscriptions.push(
      this.store$.select(getManualUsers)
        .subscribe((users: Array<ManualUsers>) => this.manualUsers = users),
    );
  }

  private initUserExistsListener(): void {
    this.subscriptions.push(
      this.clientDataForm.controls['userExists'].valueChanges
        .subscribe((userExists: boolean) => this.adjustClientValidations(userExists)),
    );
  }

  private setSelectedService(serviceId: string): void {
    this.selectedService = this.servicesList.find((serviceItem: ServicesCatalog) => serviceItem.id === serviceId);
  }

  private sendNotification(message: string, type: SweetAlertIcon): void {
    this.notificationService.showToast({ message, type });
  }

  private adjustClientValidations(userExists: boolean): void {
    if (userExists) {
      this.clientDataForm.controls['userSelected'].setValidators(Validators.required);
      this.clientDataForm.controls['name'].clearValidators();
      this.clientDataForm.controls['lastName'].clearValidators();
      this.clientDataForm.controls['phone'].clearValidators();
    }

    if (!userExists) {
      this.clientDataForm.controls['userSelected'].clearValidators();
      this.clientDataForm.controls['name'].setValidators(Validators.required);
      this.clientDataForm.controls['lastName'].setValidators(Validators.required);
      this.clientDataForm.controls['phone'].setValidators(Validators.required);
    }

    this.clientDataForm.controls['userSelected'].updateValueAndValidity();
    this.clientDataForm.controls['name'].updateValueAndValidity();
    this.clientDataForm.controls['lastName'].updateValueAndValidity();
    this.clientDataForm.controls['phone'].updateValueAndValidity();
  }
}
