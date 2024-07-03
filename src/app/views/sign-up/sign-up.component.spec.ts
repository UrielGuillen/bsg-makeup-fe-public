import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { AppMaterialModule } from '../../modules/app.material.module';
import { NotificationService } from '../../services/core/notification.service';
import { RequestSignUp } from '../../../state/authentication/authentication-actions';
import { MOCK_NOTIFICATION_SERVICE } from '../../mocks/mock-notification-service';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let store: MockStore;
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
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
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change password field type from password to text', () => {
    component.changePasswordFieldType();

    fixture.detectChanges();

    expect(component.passwordFieldType).toBe('text');
  });

  it('should change password field type from text to password', () => {
    component.passwordFieldType = 'text';
    fixture.detectChanges();

    component.changePasswordFieldType();
    fixture.detectChanges();

    expect(component.passwordFieldType).toBe('password');
  });

  it('should call sign up action', () => {
    spyOn(store, 'dispatch');

    component.signUpForm.patchValue({
      name: 'Test',
      lastName: 'Testing',
      password: '1234',
      phoneNumber: '9876543211',
      email: 'test@karma.com',
    });
    fixture.detectChanges();

    component.singUpUser();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledOnceWith(RequestSignUp({
      name: 'Test',
      lastName: 'Testing',
      password: '1234',
      phoneNumber: '9876543211',
      email: 'test@karma.com',
    }));
  });

  it('should not call sign up action', () => {
    spyOn(store, 'dispatch');

    component.singUpUser();
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
