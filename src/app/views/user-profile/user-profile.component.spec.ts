import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { AppMaterialModule } from '../../modules/app.material.module';
import { NotificationService } from '../../services/core/notification.service';
import { RequestUpdateUserData, RequestUpdateUserImage } from '../../../state/authentication/authentication-actions';
import { MOCK_USER_DATA } from '../../mocks/mock-user-data';
import { getUserData } from '../../../state/authentication/authentication-selectors';
import { UserData } from '../../interfaces/user-data.interface';
import { MOCK_NOTIFICATION_SERVICE } from '../../mocks/mock-notification-service';

import { UserProfileComponent } from './user-profile.component';

describe('UserProfileComponent', () => {
  let store: MockStore;
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileComponent ],
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
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
    store.overrideSelector(getUserData, MOCK_USER_DATA);

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not update the user profile image because the file is wrong', () => {
    spyOn(store, 'dispatch');

    const mockFile: File = new File([ '' ], 'filename', { type: 'text/html' });
    const mockFileList: FileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event: any = {
      target: {
        files: mockFileList,
      },
    };

    component.onImageSelected(event);

    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should update the user profile image', () => {
    spyOn(store, 'dispatch');

    const mockFile: File = new File([ '' ], 'filename.jpg', { type: 'image/jpeg' });
    const mockFileList: FileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event: any = {
      target: {
        files: mockFileList,
      },
    };

    component.onImageSelected(event);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledOnceWith(RequestUpdateUserImage({
      previousImg: MOCK_USER_DATA.profileUrl,
      newImg: mockFile,
    }));
  });

  it('should form be invalid to update the data', () => {
    spyOn(store, 'dispatch');

    component.userForm.controls['email'].reset('');
    fixture.detectChanges();

    component.validateForm();
    fixture.detectChanges();

    expect(component.userForm.invalid).toBeTruthy();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should form be valid to update the data', () => {
    spyOn(store, 'dispatch');

    component.validateForm();
    fixture.detectChanges();

    const updatedData: UserData = component.userForm.getRawValue();
    const userData: Partial<UserData> = {
      name: updatedData.name,
      lastName: updatedData.lastName,
      email: updatedData.email,
    };

    expect(component.userForm.valid).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledOnceWith(RequestUpdateUserData({ userData }));
  });
});
