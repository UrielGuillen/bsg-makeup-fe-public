import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { AppMaterialModule } from '../../modules/app.material.module';
import { MOCK_ACTIVATED_ROUTE } from '../../mocks/mock-activated-route';
import { MOCK_LOCATION } from '../../mocks/mock-location';
import { RequestSignOut } from '../../../state/authentication/authentication-actions';
import { getUserProfileImage, isSessionOpened } from '../../../state/authentication/authentication-selectors';
import { MOCK_HEADER_ROUTER } from '../../mocks/mock-router';
import { MOCK_NOTIFICATION_CENTRE_SERVICE } from '../../mocks/mock-notification-centre-service';

import { HeaderComponent } from './header.component';


describe('HeaderComponent', () => {
  let store: MockStore;
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        AppMaterialModule,
        RouterModule,
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
        { provide: Router, useValue: MOCK_HEADER_ROUTER },
        { provide: ActivatedRoute, useValue: MOCK_ACTIVATED_ROUTE },
        { provide: Location, useValue: MOCK_LOCATION },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    // eslint-disable-next-line angular/window-service
    window.onbeforeunload = jasmine.createSpy();

    MOCK_NOTIFICATION_CENTRE_SERVICE.getNewNotifications.and.returnValue(of(false));

    store = TestBed.inject(MockStore);
    store.overrideSelector(getUserProfileImage, 'someFakeUrl');
    store.overrideSelector(isSessionOpened, true);

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.headerTitle).toBe('Test Header');
    expect(component.isHome).toBeTruthy();
  });

  it('should emit the event to open the side nav', () => {
    spyOn(component.openSideNavEvent, 'emit');

    component.openSideNav();

    expect(component.openSideNavEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should location back to have been called', () => {
    component.goBack();

    expect(MOCK_LOCATION.back).toHaveBeenCalled();
  });

  it('should dispatch sign out user action', () => {
    spyOn(store, 'dispatch');

    component.signOutUser();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(RequestSignOut());
  });
});
