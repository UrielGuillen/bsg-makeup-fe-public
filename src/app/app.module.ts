import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp } from 'firebase/app';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AppMaterialModule } from './modules/app.material.module';
import { SidenavMenuComponent } from './components/sidenav-menu/sidenav-menu.component';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { AgendaComponent } from './views/agenda/agenda.component';
import { AppTranslateModule } from './modules/app.translate.module';
import { HttpRequestsInterceptor } from './interceptors/http-requests.interceptor';
import { ScheduleComponent } from './views/schedule/schedule.component';
import { BottomNavigationComponent } from './components/bottom-navigation/bottom-navigation.component';
import { HistoryComponent } from './views/history/history.component';
import { ServicesComponent } from './views/services/services.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { HomeComponent } from './views/home/home.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { AppStoreModule } from './modules/app-store.module';
import { SharedModule } from './modules/shared.module';
import { AlertsComponent } from './views/alerts/alerts.component';

initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavMenuComponent,
    SignInComponent,
    SignUpComponent,
    AgendaComponent,
    ScheduleComponent,
    BottomNavigationComponent,
    HistoryComponent,
    ServicesComponent,
    UserProfileComponent,
    HomeComponent,
    NoResultsComponent,
    AlertsComponent,
  ],
  imports: [
    AppRoutingModule,
    AppTranslateModule,
    AppMaterialModule,
    AppStoreModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AppModule {}
