import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { environment as env } from '../../../environments/environment';
import { NotificationService } from '../../services/core/notification.service';
import { AppState } from '../../../state/state.model';
import { RequestSignUp } from '../../../state/authentication/authentication-actions';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: [ './sign-up.component.scss' ],
})
export class SignUpComponent implements OnInit {
  public readonly logoUrl: string = env.assets.prefix + env.assets.icons + '/LogoLarge.svg';
  public signUpForm!: FormGroup;
  public passwordFieldType: string = 'password';

  constructor(
    private store$: Store<AppState>,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initSignUpForm();
  }

  public changePasswordFieldType(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  public singUpUser(): void {
    if (!this.isFormValid()) {
      this.notificationService.showToast({
        message: 'AUTHENTICATION.SIGN_UP_ERROR_MESSAGE',
        type: 'error',
      });
      return;
    }

    this.store$.dispatch(RequestSignUp(this.signUpForm.getRawValue()));
  }

  private initSignUpForm(): void {
    this.signUpForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', Validators.required),
        email: new FormControl('', Validators.email),
      },
      { updateOn: 'change' },
    );
  }

  private isFormValid(): boolean {
    const phoneNumber: string = this.signUpForm.controls['phoneNumber'].value.toString();

    return this.signUpForm.valid && phoneNumber.length === 10;
  }
}
