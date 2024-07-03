import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { UserDataResponse } from '../interfaces/user-data.interface';
import { MOCK_USER_DATA } from '../mocks/mock-user-data';
import { BaseResponse } from '../interfaces/base-response.interface';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ UsersService ],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user public data', () => {
    const fakeResponse: UserDataResponse = {
      success: true,
      message: '',
      response: MOCK_USER_DATA,
    };

    service.getUserPublicData().subscribe((response: UserDataResponse) => {
      expect(response.success).toBeTruthy();
      expect(response.response.id).toBe(MOCK_USER_DATA.id);
    });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/user/get-public-data');

    expect(request.request.method).toBe('GET');

    request.flush(fakeResponse);
  });

  it('should update the user profile image', () => {
    const fakeResponse: BaseResponse = {
      success: true,
      message: '',
    };

    service.updateProfileImage('AnyUrlImage').subscribe((response: BaseResponse) => {
      expect(response.success).toBeTruthy();
    });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/user/update-profile-image');

    expect(request.request.method).toBe('PUT');

    request.flush(fakeResponse);
  });

  it('should update user public data', () => {
    const fakeResponse: UserDataResponse = {
      success: true,
      message: '',
      response: {
        ...MOCK_USER_DATA,
        name: 'Updated name in service',
      },
    };

    service.updateBasicBasicData(MOCK_USER_DATA).subscribe((response: UserDataResponse) => {
      expect(response.success).toBeTruthy();
      expect(response.response.name).toBe(fakeResponse.response.name);
    });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/user/update-basic-data');

    expect(request.request.method).toBe('PUT');

    request.flush(fakeResponse);
  });
});
