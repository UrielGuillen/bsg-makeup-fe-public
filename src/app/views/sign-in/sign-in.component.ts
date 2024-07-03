import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { environment as env } from '../../../environments/environment';
import { NotificationService } from '../../services/core/notification.service';
import { AppState } from '../../../state/state.model';
import { RequestSignIn } from '../../../state/authentication/authentication-actions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: [ './sign-in.component.scss' ],
})
export class SignInComponent implements OnInit {
  public readonly logoUrl: string = env.assets.prefix + env.assets.icons + '/LogoLarge.svg';
  public signIpForm!: FormGroup;
  public passwordFieldType: string = 'password';

  constructor(
    private store$: Store<AppState>,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initSignUpForm();
  }

  public showPassword(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  public singInUser(): void {
    if (!this.isFormValid()) {
      this.notificationService.showToast({
        message: 'AUTHENTICATION.SIGN_IN_ERROR_MESSAGE',
        type: 'error',
      });
      return;
    }

    this.store$.dispatch(RequestSignIn(this.signIpForm.getRawValue()));
  }

  private isFormValid(): boolean {
    const phoneNumber: string = this.signIpForm.controls['phoneNumber'].value.toString();

    return this.signIpForm.valid && phoneNumber.length === 10;
  }

  private initSignUpForm(): void {
    this.signIpForm = new FormGroup(
      {
        phoneNumber: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
      },
      { updateOn: 'change' },
    );
  }
}
