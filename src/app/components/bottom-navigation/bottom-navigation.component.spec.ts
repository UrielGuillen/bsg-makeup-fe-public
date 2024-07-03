import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { AppMaterialModule } from '../../modules/app.material.module';
import { MOCK_ACTIVATED_ROUTE } from '../../mocks/mock-activated-route';
import { MOCK_ROUTER } from '../../mocks/mock-router';
import { SetHourSelected } from '../../../state/appointments/appointments-actions';
import { MOCK_NOTIFICATION_CENTRE_SERVICE } from '../../mocks/mock-notification-centre-service';
import { NotificationCentreService } from '../../services/notification-centre.service';

import { BottomNavigationComponent } from './bottom-navigation.component';

describe('BottomNavigationComponent', () => {
  let store: MockStore;
  let component: BottomNavigationComponent;
  let fixture: ComponentFixture<BottomNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomNavigationComponent ],
      imports: [
        AppMaterialModule,
        RouterModule,
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
        { provide: ActivatedRoute, useValue: MOCK_ACTIVATED_ROUTE },
        { provide: NotificationCentreService, useValue: MOCK_NOTIFICATION_CENTRE_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    MOCK_NOTIFICATION_CENTRE_SERVICE.getNewNotifications.and.returnValue(of(true));

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BottomNavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();

    tick(8000);

    expect(component).toBeTruthy();
  }));

  it('should emit event to open the side nav', () => {
    spyOn(component.openSideNavEvent, 'emit');

    fixture.detectChanges();

    component.openSideNav();

    fixture.detectChanges();

    expect(component.openSideNavEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should navigate to schedule view', () => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.goToSchedule();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(SetHourSelected({ hour: { id: 0, hour: '' } }));
    expect(MOCK_ROUTER.navigate).toHaveBeenCalledWith([ '/', 'schedule' ]);
  });
});
