import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { SignInUser } from '../interfaces/sign-in-user.interface';
import { TokenUserResponse } from '../interfaces/token-response.interface';
import { SignUpUser } from '../interfaces/sign-up-user.interface';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AuthenticationService ],
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign in an user', () => {
    const fakeUser: SignInUser = {
      phoneNumber: '123',
      password: '456',
    };

    service.signInUser(fakeUser).subscribe((response: TokenUserResponse) => {
      expect(response.success).toBeTruthy();
      expect(response.response).toBe('FakeSignInToken');
    });

    const req: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/auth/sign-in');

    expect(req.request.method).toBe('POST');
    req.flush({ success: true, response: 'FakeSignInToken' });
  });

  it('should sign up an user', () => {
    const fakeUser: SignUpUser = {
      name: 'Test name',
      lastName: 'Test last name',
      phoneNumber: '123',
      password: '456',
      email: 'test@karma.com',
    };

    service.signUpUser(fakeUser).subscribe((response: TokenUserResponse) => {
      expect(response.success).toBeTruthy();
      expect(response.response).toBe('FakeSignUpToken');
    });

    const req: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/auth/sign-up');

    expect(req.request.method).toBe('POST');
    req.flush({ success: true, response: 'FakeSignUpToken' });
  });

  it('should sign out a logged user', () => {
    spyOn(localStorage, 'removeItem');

    service.signOutUser();

    expect(localStorage.removeItem).toHaveBeenCalledWith('Authorization');
  });

  it('should return the token from the storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('FakeLoggedUserToken');

    expect(service.getAuthToken()).toBe('FakeLoggedUserToken');
  });

  it('should not return the token from the storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    expect(service.getAuthToken()).toBe('');
  });

  it('should validate the type of the logged user', () => {
    spyOn(service, 'getDataFromToken').and.returnValue('user');

    expect(service.isTypeUser()).toBeTruthy();
  });

  it('should save the token properly', () => {
    spyOn(localStorage, 'setItem');

    service.saveToken({
      success: true,
      message: 'User logged',
      response: 'FakeLoggedUser',
    });

    expect(localStorage.setItem).toHaveBeenCalledOnceWith('Authorization', 'FakeLoggedUser');
  });
});
