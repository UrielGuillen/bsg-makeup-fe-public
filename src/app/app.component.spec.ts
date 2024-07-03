import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { isSessionOpened } from '../state/authentication/authentication-selectors';
import { getLoadingStatus } from '../state/configuration/configuration-selectors';

import { AppComponent } from './app.component';
import { MOCK_INITIAL_STATE } from './mocks/mock-initial-state';
import { HeaderComponent } from './components/header/header.component';
import { BottomNavigationComponent } from './components/bottom-navigation/bottom-navigation.component';
import { AppMaterialModule } from './modules/app.material.module';
import { SidenavMenuComponent } from './components/sidenav-menu/sidenav-menu.component';
import { MOCK_ROUTER } from './mocks/mock-router';
import { MOCK_ACTIVATED_ROUTE } from './mocks/mock-activated-route';
import { LoadingStatus } from './enums/loading-status.enum';
import { GoogleMapsService } from './services/gcp/google-maps.service';
import { MOCK_GOOGLE_MAPS_SERVICE } from './mocks/mock-google-maps-service';
import { AuthenticationService } from './services/authentication.service';
import { MOCK_AUTHENTICATION_SERVICE } from './mocks/mock-authentication-service';
import { ListenNotificationsService } from './services/firebase/listen-notifications.service';
import { MOCK_LISTEN_NOTIFICATION_SERVICE } from './mocks/mock-listen-notifications-service';

describe('AppComponent', () => {
  let store: MockStore;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        BottomNavigationComponent,
        SidenavMenuComponent,
      ],
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
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
        { provide: GoogleMapsService, useValue: MOCK_GOOGLE_MAPS_SERVICE },
        { provide: AuthenticationService, useValue: MOCK_AUTHENTICATION_SERVICE },
        { provide: ListenNotificationsService, useValue: MOCK_LISTEN_NOTIFICATION_SERVICE },
        DateAdapter,
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    store = TestBed.inject(MockStore);
    translateService = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    spyOn(store, 'dispatch').and.returnValue();
    store.overrideSelector(isSessionOpened, true);
    store.overrideSelector(getLoadingStatus, LoadingStatus.Completed);

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should open the side nav', () => {
    component.openSideNav('start');

    fixture.detectChanges();

    expect(component.isSidenavMenuOpened).toBeTruthy();
  });

  it('should close the side nav', () => {
    component.openSideNav('start');

    fixture.detectChanges();

    expect(component.isSidenavMenuOpened).toBeTruthy();

    component.closeSideNavMenu();

    fixture.detectChanges();

    expect(component.isSidenavMenuOpened).toBeFalsy();
  });

  it('should set the language to es', () => {
    spyOn(translateService, 'use');

    component.setLanguage('es');

    fixture.detectChanges();

    expect(translateService.use).toHaveBeenCalledWith('es');
  });

  it('should set the language to en', () => {
    spyOn(translateService, 'use');

    component.setLanguage('en');

    fixture.detectChanges();

    expect(translateService.use).toHaveBeenCalledWith('en');
  });
});
