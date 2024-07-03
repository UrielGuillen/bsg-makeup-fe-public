import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { UserData } from '../../interfaces/user-data.interface';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../services/core/notification.service';
import { AppState } from '../../../state/state.model';
import { getUserData } from '../../../state/authentication/authentication-selectors';
import { RequestUpdateUserData, RequestUpdateUserImage } from '../../../state/authentication/authentication-actions';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [ './user-profile.component.scss' ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public photoUrl!: string;
  public userForm: FormGroup = new FormGroup({});
  public userData!: UserData;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private store$: Store<AppState>,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initUserDataListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public onImageSelected(event: Event): void {
    const filesSelected: FileList | null = (event.target as HTMLInputElement).files;

    if (filesSelected) {
      const file: File | null = filesSelected[0];

      if (!file.type.includes('image')) {
        this.notificationService.showToast({
          message: 'PROFILE.FILE_SELECTED_NOT_SUPPORTED',
          type: 'error',
        });
        return;
      }

      this.store$.dispatch(
        RequestUpdateUserImage({
          previousImg: this.userData.profileUrl,
          newImg: this.getUpdatedFileSelected(file),
        }),
      );
    }
  }

  public validateForm(): void {
    if (this.userForm.invalid) {
      this.notificationService.showToast({
        message: 'PROFILE.MISSING_DATA',
        type: 'error',
      });
      return;
    }

    this.updateUserBasicData();
  }

  private updateUserBasicData(): void {
    const updatedData: UserData = this.userForm.getRawValue();

    const userData: Partial<UserData> = {
      name: updatedData.name,
      lastName: updatedData.lastName,
      email: updatedData.email,
    };

    this.store$.dispatch(RequestUpdateUserData({ userData }));
  }

  private initUserDataListener(): void {
    this.subscriptions.push(
      this.store$.select(getUserData).subscribe((data: UserData) => {
        if (data && data.id) {
          this.userData = data;
          this.initForm(data);

          if (data.profileUrl) {
            this.photoUrl = environment.profilePhotos.url + data.profileUrl;
          }
        }
      }),
    );
  }

  private initForm(data: UserData): void {
    this.userForm = new FormGroup({
      id: new FormControl(data.id),
      profilePhoto: new FormControl({
        value: data.profileUrl,
        disabled: false,
      }),
      name: new FormControl({ value: data.name, disabled: false }, [ Validators.required ]),
      lastName: new FormControl({ value: data.lastName, disabled: false }, [ Validators.required ]),
      email: new FormControl({ value: data.email, disabled: false }, [ Validators.required, Validators.email ]),
      phoneNumber: new FormControl({ value: data.phoneNumber, disabled: true }),
    });
  }

  private getUpdatedFileSelected(file: File): File {
    const fileAsBlob: Blob = file.slice(0, file.size, file.type);
    const fileName: string = this.userData.id + '-' + new Date().getTime() + '.' + file.name.split('.')[1];

    return new File([ fileAsBlob ], fileName, { type: file.type });
  }
}
