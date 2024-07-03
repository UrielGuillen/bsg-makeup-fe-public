import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { enUS, es } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns';
import { DateAdapter } from '@angular/material/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../state/state.model';
import { RequestServicesCatalog } from '../state/configuration/configuration-actions';
import { getLoadingStatus } from '../state/configuration/configuration-selectors';
import { isSessionOpened } from '../state/authentication/authentication-selectors';
import { RequestUserData, RequestUserNotifications } from '../state/authentication/authentication-actions';
import { LoadScheduledAppointments, RequestManualUsersList } from '../state/appointments/appointments-actions';

import { LoadingStatus } from './enums/loading-status.enum';
import { GoogleMapsService } from './services/gcp/google-maps.service';
import { AuthenticationService } from './services/authentication.service';
import { ListenNotificationsService } from './services/firebase/listen-notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit, AfterViewInit {
  public defaultLanguage: string = 'es';
  public sideNavPosition: 'start' | 'end' = 'start';
  public viewsWithoutBottomNavigation: Array<string> = [ '/', '/feed', '/home', '/sign-in', '/sign-up' ];
  public isSidenavMenuOpened: boolean = false;
  public showLoader: boolean = true;
  public showBottomNavigation: boolean = false;

  constructor(
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private store$: Store<AppState>,
    private router: Router,
    private googleMapsService: GoogleMapsService,
    private authService: AuthenticationService,
    private listenNotificationService: ListenNotificationsService,
  ) {}

  ngOnInit(): void {
    this.initGoogleMaps();
    this.validateLanguage();
    this.initSessionListener();
    this.initShowLoaderListener();
    this.initRouteChangeListener();
  }

  ngAfterViewInit(): void {
    this.initFirebaseListener();
  }

  public openSideNav(position: 'start' | 'end'): void {
    this.sideNavPosition = position;
    this.isSidenavMenuOpened = true;
  }

  public closeSideNavMenu(): void {
    this.isSidenavMenuOpened = false;
  }

  public setLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.translateService.use(language);

    if (language === 'es') {
      setDefaultOptions({ locale: es });
    } else {
      setDefaultOptions({ locale: enUS });
    }
    this.dateAdapter.setLocale(language);
  }

  private validateLanguage(): void {
    const languageStored: string | null = localStorage.getItem('language');

    if (languageStored) {
      this.defaultLanguage = languageStored;

      this.setLanguage(languageStored);
    } else {
      this.translateService.setDefaultLang(this.defaultLanguage);
      this.setLanguage(this.defaultLanguage);
    }
  }

  private initShowLoaderListener(): void {
    this.store$.select(getLoadingStatus).subscribe((status: LoadingStatus) => (this.showLoader = status === LoadingStatus.InProgress));
  }

  private initRouteChangeListener(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.showBottomNavigation = !this.viewsWithoutBottomNavigation.includes(route.url);
      }
    });
  }

  private initSessionListener(): void {
    this.store$.select(isSessionOpened).subscribe((isSessionOpened: boolean) => {
      if (isSessionOpened) {
        this.store$.dispatch(RequestUserData());
        this.store$.dispatch(RequestServicesCatalog());
        this.store$.dispatch(LoadScheduledAppointments());
        this.store$.dispatch(RequestUserNotifications());
        this.initAdminData();
      }
    });
  }

  private initAdminData(): void {
    if (!this.authService.isTypeUser()) {
      this.store$.dispatch(RequestManualUsersList());
    }
  }

  private initGoogleMaps(): void {
    this.googleMapsService.initMap().then();
  }

  private initFirebaseListener(): void {
    this.store$.select(isSessionOpened).subscribe((isSessionOpened: boolean) => {
      if (isSessionOpened) {
        this.listenNotificationService.requestPermission();
        this.listenNotificationService.listen();
      }
    });
  }
}
