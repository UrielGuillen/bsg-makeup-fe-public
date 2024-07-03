import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppointmentsService } from '../../services/appointments.service';
import { AuthenticationService } from '../../services/authentication.service';
import { NotificationService } from '../../services/core/notification.service';
import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { NoResultsComponent } from '../../components/no-results/no-results.component';
import { AppMaterialModule } from '../../modules/app.material.module';
import { MOCK_AUTHENTICATION_SERVICE } from '../../mocks/mock-authentication-service';
import { getUserAppointments } from '../../../state/appointments/appointments-selectors';
import { MOCK_APPOINTMENT_WITH_FEEDBACK, MOCK_APPOINTMENTS_LIST } from '../../mocks/mock-appointments-list';
import { MinutesToHoursPipe } from '../../pipes/minutes-to-hours.pipe';
import { MOCK_NOTIFICATION_SERVICE } from '../../mocks/mock-notification-service';

import { HistoryComponent } from './history.component';

describe('HistoryComponent', () => {
  let store: MockStore;
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HistoryComponent,
        NoResultsComponent,
        MinutesToHoursPipe,
      ],
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        provideMockStore({ initialState: MOCK_INITIAL_STATE }),
        { provide: AuthenticationService, useValue: MOCK_AUTHENTICATION_SERVICE },
        { provide: NotificationService, useValue: MOCK_NOTIFICATION_SERVICE },
        AppointmentsService,
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    MOCK_AUTHENTICATION_SERVICE.isTypeUser.and.returnValue(true);

    store = TestBed.inject(MockStore);
    store.overrideSelector(getUserAppointments, [
      ...MOCK_APPOINTMENTS_LIST,
      ...[ MOCK_APPOINTMENT_WITH_FEEDBACK ],
    ]);

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should admin user be able to validate the feedback of an appointment', () => {
    expect(component.canValidateFeedback(MOCK_APPOINTMENT_WITH_FEEDBACK)).toBeTruthy();
  });

  it('should admin user be able to see the feedback of an appointment', () => {
    MOCK_AUTHENTICATION_SERVICE.isTypeUser.and.returnValue(false);

    expect(component.isUserAllowed(MOCK_APPOINTMENTS_LIST[3].status)).toBeTruthy();
  });
});
