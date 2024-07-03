import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { SweetAlertIcon } from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { HomeServices } from '../../interfaces/home-services.interface';
import { environment } from '../../../environments/environment';
import { ContactUserService } from '../../services/contact-user.service';
import { ContactUser } from '../../interfaces/contact-user.interface';
import { NotificationService } from '../../services/core/notification.service';
import { BaseResponse } from '../../interfaces/base-response.interface';
import { AppState } from '../../../state/state.model';
import { isUserAuthenticated } from '../../../state/authentication/authentication-selectors';
import { GoogleMapsService } from '../../services/gcp/google-maps.service';
import { HOME_SERVICES } from '../../const/home-services.const';
import { Certifications } from '../../interfaces/certifications.interface';
import { CERTIFICATIONS } from '../../const/certifications.const';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public readonly appVersion: string = environment.version;
  public readonly mapOptions: google.maps.MapOptions = this.googleMapsService.getMapOptions();
  public readonly homeServices: Array<HomeServices> = HOME_SERVICES;
  public readonly certifications: Array<Certifications> = CERTIFICATIONS;
  public mapCircleOptions: google.maps.CircleOptions | undefined = undefined;
  public assetsPrefixUrl: string = environment.assets.prefix;
  public contactForm!: FormGroup;
  public isUserAuthenticated: boolean = false;

  private subscriptions: Array<Subscription> = [];

  @ViewChild('googleMaps', { static: false }) map!: GoogleMap;

  constructor(
    private store$: Store<AppState>,
    private notificationService: NotificationService,
    private contactUserService: ContactUserService,
    private googleMapsService: GoogleMapsService,
  ) {}

  ngOnInit(): void {
    this.initLoggedUserListener();
    this.initContactForm();
  }

  ngAfterViewInit(): void {
    // eslint-disable-next-line angular/timeout-service
    setTimeout(() => {
      this.mapCircleOptions = this.googleMapsService.getMapCircleOptions(this.map);

      this.googleMapsService.initCircle(this.mapCircleOptions);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public trackByServiceId(index: number, item: HomeServices): number {
    return item.id;
  }

  public createContactUser(): void {
    const contactUser: ContactUser = this.contactForm.getRawValue();

    this.subscriptions.push(
      this.contactUserService.createContactUser(contactUser).subscribe((response: BaseResponse) => this.handleNotification(response)),
    );
  }

  public getRoute(): Array<string> {
    if (this.isUserAuthenticated) {
      return [ '/', 'agenda' ];
    }

    return [ '/', 'sign-in' ];
  }

  private handleNotification(response: BaseResponse): void {
    const notificationType: SweetAlertIcon = response.success ? 'success' : 'error';

    this.notificationService.showToast({
      message: response.message,
      type: notificationType,
    });

    if (response.success) {
      this.contactForm.reset();
    }
  }

  private initContactForm(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
      phone: new FormControl('', [ Validators.required, Validators.pattern('[0-9 ]{10}') ]),
      message: new FormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(100) ]),
    });
  }

  private initLoggedUserListener(): void {
    this.subscriptions.push(
      this.store$.select(isUserAuthenticated).subscribe((authenticated: boolean) => (this.isUserAuthenticated = authenticated)),
    );
  }
}
