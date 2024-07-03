import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { AuthenticationService } from '../../services/authentication.service';
import { AppMaterialModule } from '../../modules/app.material.module';
import { SharedModule } from '../../modules/shared.module';
import { MOCK_ACTIVATED_ROUTE } from '../../mocks/mock-activated-route';
import { MOCK_AUTHENTICATION_SERVICE } from '../../mocks/mock-authentication-service';
import { MOCK_ROUTER } from '../../mocks/mock-router';
import { NotificationService } from '../../services/core/notification.service';
import {
  getHourSelected, getManualUsers,
  getScheduledAppointments,
  getSelectedDate,
} from '../../../state/appointments/appointments-selectors';
import { MOCK_APPOINTMENTS_LIST } from '../../mocks/mock-appointments-list';
import { getServicesList } from '../../../state/configuration/configuration-selectors';
import { MOCK_SERVICES_CATALOG } from '../../mocks/mock-services-catalog';
import { formatScheduledDate } from '../../utils/date.utils';
import { CreateAdminAppointment, CreateUserAppointment } from '../../../state/appointments/appointments-actions';
import { MOCK_NOTIFICATION_SERVICE } from '../../mocks/mock-notification-service';
import { MOCK_MANUAL_USER_LIST } from '../../mocks/mock-manual-user-list';

import { ScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let store: MockStore;
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ScheduleComponent,
      ],
      imports: [
        AppMaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        provideMockStore({ initialState: MOCK_INITIAL_STATE }),
        { provide: ActivatedRoute, useValue: MOCK_ACTIVATED_ROUTE },
        { provide: AuthenticationService, useValue: MOCK_AUTHENTICATION_SERVICE },
        { provide: Router, useValue: MOCK_ROUTER },
        { provide: NotificationService, useValue: MOCK_NOTIFICATION_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(getScheduledAppointments, MOCK_APPOINTMENTS_LIST);
    store.overrideSelector(getServicesList, MOCK_SERVICES_CATALOG);
    store.overrideSelector(getHourSelected, { id: 1, hour: '08:00' });
    store.overrideSelector(getSelectedDate, formatScheduledDate(new Date()));
    store.overrideSelector(getManualUsers, MOCK_MANUAL_USER_LIST);

    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create the appointment because is not completed', () => {
    spyOn(store, 'dispatch');

    component.validateForm();

    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should create the user appointment', () => {
    spyOn(store, 'dispatch');

    component.selectDateForm.patchValue({
      date: new Date('01-01-2024'),
      time: '16:00',
    });
    component.selectServiceForm.patchValue({
      service: '1',
    });
    component.selectedService = MOCK_SERVICES_CATALOG[0];
    component.isUserAllowed = false;

    fixture.detectChanges();

    component.validateForm();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledOnceWith(CreateUserAppointment({
      appointment: {
        scheduledDate: '01/01/2024',
        time: '16:00',
        serviceId: '1',
        userId: '',
      },
    }));
  });

  it('should create an admin appointment', () => {
    MOCK_AUTHENTICATION_SERVICE.isTypeUser.and.returnValue(false);
    spyOn(store, 'dispatch');

    component.selectDateForm.patchValue({
      date: new Date('01-01-2024'),
      time: '16:00',
    });
    component.selectServiceForm.patchValue({
      service: '1',
    });
    component.clientDataForm.patchValue({
      name: 'test',
      lastName: 'lastTest',
      phone: '123',
      userExists: false,
    });
    component.selectedService = MOCK_SERVICES_CATALOG[0];

    fixture.detectChanges();

    component.validateForm();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledOnceWith(CreateAdminAppointment({
      appointment: {
        scheduledDate: '01/01/2024',
        time: '16:00',
        serviceId: '1',
        userId: '',
        name: 'test',
        lastName: 'lastTest',
        phone: '123',
        userExists: false,
      },
    }));
  });

  it('should manual users logic work properly', () => {
    component.isUserAllowed = true;
    component.clientDataForm.patchValue({ userExists: true });
    component.onUserSelected(MOCK_MANUAL_USER_LIST[0]);

    fixture.detectChanges();

    expect(component.selectedUser).toBeDefined();
    expect(component.selectedUser.id).toBe('1');
  });

  it('should not create the appointment because there is a hour conflict', () => {
    spyOn(store, 'dispatch');

    component.selectDateForm.patchValue({
      date: new Date('01-01-2024'),
      time: '08:00',
    });
    component.selectServiceForm.patchValue({
      service: '1',
    });
    component.selectedService = MOCK_SERVICES_CATALOG[0];
    component.isUserAllowed = false;

    fixture.detectChanges();

    component.validateForm();

    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(MOCK_NOTIFICATION_SERVICE.showNotification).toHaveBeenCalled();
  });
});
