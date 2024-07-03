import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ContactUser } from '../interfaces/contact-user.interface';
import { BaseResponse } from '../interfaces/base-response.interface';

import { ContactUserService } from './contact-user.service';

describe('ContactUserService', () => {
  let service: ContactUserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ContactUserService ],
    });

    service = TestBed.inject(ContactUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a contact user', () => {
    const fakeContactUser: ContactUser = {
      name: 'Contact name',
      phone: 12345,
      message: 'bla bla blah',
    };

    service.createContactUser(fakeContactUser).subscribe((response: BaseResponse) => {
      expect(response.success).toBeTruthy();
    });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/contact/user');

    expect(request.request.method).toBe('POST');

    request.flush({ success: true, message: 'User contact created successfully' });
  });
});
