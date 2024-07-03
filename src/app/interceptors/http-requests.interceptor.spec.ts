import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { MOCK_AUTHENTICATION_SERVICE } from '../mocks/mock-authentication-service';
import { NotificationService } from '../services/core/notification.service';
import { MOCK_NOTIFICATION_SERVICE } from '../mocks/mock-notification-service';

import { HttpRequestsInterceptor } from './http-requests.interceptor';

describe('HttpRequestsInterceptor', () => {
  let httpMock: HttpTestingController;
  let service: MockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestsInterceptor, multi: true },
        { provide: AuthenticationService, useValue: MOCK_AUTHENTICATION_SERVICE },
        { provide: NotificationService, useValue: MOCK_NOTIFICATION_SERVICE },
        HttpRequestsInterceptor,
        MockService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MockService);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    const interceptor: HttpRequestsInterceptor = TestBed.inject(HttpRequestsInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should have the Authorization header', () => {
    MOCK_AUTHENTICATION_SERVICE.getAuthToken.and.returnValue('TokenToBeAddedInInterceptor');

    service.getData().subscribe();

    const httpRequest: TestRequest = httpMock.expectOne('/data');

    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe('TokenToBeAddedInInterceptor');

    httpRequest.flush({ message: 'Testing interceptor' });
  });

  it('should handle 400 error successfully', () => {
    MOCK_AUTHENTICATION_SERVICE.getAuthToken.and.returnValue('TokenToBeAddedInInterceptor');

    service.getAuth().subscribe(() => fail('should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
      },
    );

    const httpRequest: TestRequest = httpMock.expectOne('/auth');

    httpRequest.flush('400 error', { status: 400, statusText: 'Bad request' });
  });

  it('should handle 400 error successfully sign in out user', () => {
    MOCK_AUTHENTICATION_SERVICE.getAuthToken.and.returnValue('TokenToBeAddedInInterceptor');

    service.getData().subscribe(() => fail('should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
      },
    );

    const httpRequest: TestRequest = httpMock.expectOne('/data');

    httpRequest.flush('400 error', { status: 400, statusText: 'Bad request' });

    expect(MOCK_AUTHENTICATION_SERVICE.signOutUser).toHaveBeenCalled();
  });

  it('should handle 0 error successfully', () => {
    MOCK_AUTHENTICATION_SERVICE.getAuthToken.and.returnValue('TokenToBeAddedInInterceptor');

    service.getData().subscribe(() => fail('should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(0);
      },
    );

    const httpRequest: TestRequest = httpMock.expectOne('/data');

    httpRequest.flush('0 error', { status: 0, statusText: 'Unknown error' });
  });

  it('should handle any other error code successfully', () => {
    MOCK_AUTHENTICATION_SERVICE.getAuthToken.and.returnValue('TokenToBeAddedInInterceptor');

    service.getData().subscribe(() => fail('should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      },
    );

    const httpRequest: TestRequest = httpMock.expectOne('/data');

    httpRequest.flush('404 error', { status: 404, statusText: 'Unknown error' });
  });
});

@Injectable()
class MockService {
  constructor(private http: HttpClient) { }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public getData() {
    return this.http.get('/data');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public getAuth() {
    return this.http.get('/auth');
  }
}
