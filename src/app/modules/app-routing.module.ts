import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from '../views/sign-in/sign-in.component';
import { SignUpComponent } from '../views/sign-up/sign-up.component';
import { AgendaComponent } from '../views/agenda/agenda.component';
import { AuthenticationService } from '../services/authentication.service';
import { ScheduleComponent } from '../views/schedule/schedule.component';
import { HistoryComponent } from '../views/history/history.component';
import { ServicesComponent } from '../views/services/services.component';
import { UserProfileComponent } from '../views/user-profile/user-profile.component';
import { HomeComponent } from '../views/home/home.component';
import { AlertsComponent } from '../views/alerts/alerts.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'feed',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [ (): boolean => inject(AuthenticationService).getAuthToken() === '' ],
    data: {
      headerTitle: 'HEADER.TITLES.SIGN_IN',
    },
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [ (): boolean => inject(AuthenticationService).getAuthToken() === '' ],
    data: {
      headerTitle: 'HEADER.TITLES.SIGN_UP',
    },
  },
  {
    path: 'agenda',
    component: AgendaComponent,
    data: {
      headerTitle: 'HEADER.TITLES.AGENDA',
    },
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [ (): boolean => inject(AuthenticationService).getAuthToken() !== '' ],
    data: {
      headerTitle: 'HEADER.TITLES.SCHEDULE',
    },
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [ (): boolean => inject(AuthenticationService).getAuthToken() !== '' ],
    data: {
      headerTitle: 'HEADER.TITLES.HISTORY',
    },
  },
  {
    path: 'services',
    component: ServicesComponent,
    data: {
      headerTitle: 'HEADER.TITLES.SERVICES',
    },
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [ (): boolean => inject(AuthenticationService).getAuthToken() !== '' ],
    data: {
      headerTitle: 'HEADER.TITLES.PROFILE',
    },
  },
  {
    path: 'alerts',
    component: AlertsComponent,
    canActivate: [ (): boolean => inject(AuthenticationService).getAuthToken() !== '' ],
    data: {
      headerTitle: 'HEADER.TITLES.ALERTS',
    },
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
