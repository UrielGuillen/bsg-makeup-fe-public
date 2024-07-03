import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { of } from 'rxjs';

import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { AppMaterialModule } from '../../modules/app.material.module';
import { MOCK_ACTIVATED_ROUTE } from '../../mocks/mock-activated-route';
import { isUserAuthenticated } from '../../../state/authentication/authentication-selectors';
import { ContactUserService } from '../../services/contact-user.service';
import { MOCK_CONTACT_USER_SERVICE } from '../../mocks/mock-contact-user-service';
import { NotificationService } from '../../services/core/notification.service';
import { GoogleMapsService } from '../../services/gcp/google-maps.service';
import { MOCK_NOTIFICATION_SERVICE } from '../../mocks/mock-notification-service';
import { MOCK_GOOGLE_MAPS_SERVICE } from '../../mocks/mock-google-maps-service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let store: MockStore;
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line angular/window-service
    window['google'] = { maps: { Map: class {}, Marker: class {}, LatLng: class {} } };

    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        AppMaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterModule,
        HttpClientTestingModule,
        GoogleMapsModule,
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
        { provide: ContactUserService, useValue: MOCK_CONTACT_USER_SERVICE },
        { provide: NotificationService, useValue: MOCK_NOTIFICATION_SERVICE },
        { provide: GoogleMapsService, useValue: MOCK_GOOGLE_MAPS_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(isUserAuthenticated, true);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a contact user model', () => {
    MOCK_CONTACT_USER_SERVICE.createContactUser.and.returnValue(of({
      success: true,
      message: 'User will be contacted soon',
    }));

    component.contactForm.patchValue({
      name: 'User test',
      phone: '567',
      message: 'Created in unit test',
    });

    fixture.detectChanges();

    component.createContactUser();

    fixture.detectChanges();

    expect(MOCK_CONTACT_USER_SERVICE.createContactUser).toHaveBeenCalledWith({
      name: 'User test',
      phone: '567',
      message: 'Created in unit test',
    });
  });

  it('should not create a contact user model', () => {
    MOCK_CONTACT_USER_SERVICE.createContactUser.and.returnValue(of({
      success: false,
      message: 'User cannot be created',
    }));

    component.contactForm.patchValue({
      name: 'User test',
      phone: '567',
      message: 'Created in unit test',
    });

    fixture.detectChanges();

    component.createContactUser();

    fixture.detectChanges();

    expect(MOCK_CONTACT_USER_SERVICE.createContactUser).toHaveBeenCalledWith({
      name: 'User test',
      phone: '567',
      message: 'Created in unit test',
    });
  });

  it('should return sign-in route because user is not authenticated', () => {
    component.isUserAuthenticated = false;

    fixture.detectChanges();

    expect(component.getRoute()).toEqual([ '/', 'sign-in' ]);
  });
});
