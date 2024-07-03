import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppMaterialModule } from '../../modules/app.material.module';
import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { NotificationService } from '../../services/core/notification.service';
import { RequestSignIn } from '../../../state/authentication/authentication-actions';
import { MOCK_NOTIFICATION_SERVICE } from '../../mocks/mock-notification-service';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let store: MockStore;
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInComponent ],
      imports: [
        AppMaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        provideMockStore({ initialState: MOCK_INITIAL_STATE }),
        { provide: NotificationService, useValue: MOCK_NOTIFICATION_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change password field type from password to text', () => {
    component.showPassword();

    fixture.detectChanges();

    expect(component.passwordFieldType).toBe('text');
  });

  it('should change password field type from text to password', () => {
    component.passwordFieldType = 'text';
    fixture.detectChanges();

    component.showPassword();
    fixture.detectChanges();

    expect(component.passwordFieldType).toBe('password');
  });

  it('should call sign in action', () => {
    spyOn(store, 'dispatch');

    component.signIpForm.patchValue({
      phoneNumber: '1234567899',
      password: 'somePassword',
    });
    fixture.detectChanges();

    component.singInUser();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledOnceWith(RequestSignIn({
      phoneNumber: '1234567899',
      password: 'somePassword',
    }));
  });

  it('should not call sign in action', () => {
    spyOn(store, 'dispatch');

    component.signIpForm.patchValue({
      phoneNumber: '123',
      password: 'somePassword',
    });
    fixture.detectChanges();

    component.singInUser();
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
