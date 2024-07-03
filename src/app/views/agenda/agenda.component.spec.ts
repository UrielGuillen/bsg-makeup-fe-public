import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { AppMaterialModule } from '../../modules/app.material.module';
import { MOCK_ROUTER } from '../../mocks/mock-router';
import { SetHourSelected } from '../../../state/appointments/appointments-actions';
import { getScheduledAppointments } from '../../../state/appointments/appointments-selectors';
import { MOCK_APPOINTMENTS_LIST } from '../../mocks/mock-appointments-list';
import { AppointmentDetailComponent } from '../../components/appointment-detail/appointment-detail.component';
import { SharedModule } from '../../modules/shared.module';
import { AuthenticationService } from '../../services/authentication.service';
import { MOCK_AUTHENTICATION_SERVICE } from '../../mocks/mock-authentication-service';

import { AgendaComponent } from './agenda.component';

describe('AgendaComponent', () => {
  let store: MockStore;
  let component: AgendaComponent;
  let fixture: ComponentFixture<AgendaComponent>;
  let dialogFixture: ComponentFixture<AppointmentDetailComponent>;
  let loader: HarnessLoader;
  // eslint-disable-next-line @typescript-eslint/typedef
  const mockMatDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AgendaComponent,
      ],
      imports: [
        AppMaterialModule,
        SharedModule,
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
        { provide: Router, useValue: MOCK_ROUTER },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { data: MOCK_APPOINTMENTS_LIST[0] } },
        { provide: AuthenticationService, useValue: MOCK_AUTHENTICATION_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(getScheduledAppointments, MOCK_APPOINTMENTS_LIST);

    fixture = TestBed.createComponent(AgendaComponent);
    dialogFixture = TestBed.createComponent(AppointmentDetailComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
    dialogFixture.detectChanges();

    loader = TestbedHarnessEnvironment.documentRootLoader(dialogFixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to schedule view', () => {
    spyOn(store, 'dispatch');

    component.goToSchedule({ id: 1, hour: '08:00' });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(SetHourSelected({ hour: { id: 1, hour: '08:00' } }));
    expect(MOCK_ROUTER.navigate).toHaveBeenCalledWith([ '/', 'schedule' ]);
  });

  it('should move one day forward', () => {
    spyOn(store, 'dispatch');

    component.moveOneDayForward();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should move one day back', () => {
    spyOn(store, 'dispatch');

    component.moveOneDayBack();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should reset the date to the current ', () => {
    spyOn(store, 'dispatch');

    component.moveOneDayForward();

    fixture.detectChanges();

    component.resetCalendar();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledTimes(4);
  });

  it('should open appointment detail dialog', async () => {
    component.openAppointmentDetails(MOCK_APPOINTMENTS_LIST[0]);

    const dialogs: Array<MatDialogHarness> = await loader.getAllHarnesses(MatDialogHarness);

    expect(dialogs.length).toBe(1);
  });
});
