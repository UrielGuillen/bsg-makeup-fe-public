import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { NotificationService } from '../services/core/notification.service';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class HttpRequestsInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.updateRequestHeaders(request)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          return this.endRequest('INTERCEPTOR.UNKNOWN_ERROR', error);
        }

        if (error.status === 400) {
          if (request.url.includes('auth')) {
            return throwError(() => error);
          }

          this.authenticationService.signOutUser();
          return this.endRequest('INTERCEPTOR.INVALID_OR_EXPIRED_TOKEN', error);
        }

        return throwError(() => error);
      }),
    );
  }

  private endRequest(message: string, error: HttpErrorResponse): Observable<never> {
    this.sendMessage(message);
    return throwError(() => error);
  }

  private sendMessage(message: string): void {
    this.notificationService.showToast({
      type: 'error',
      message,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private updateRequestHeaders(request: HttpRequest<any>): HttpRequest<any> {
    let headers: HttpHeaders = request.headers.append('Content-Type', 'application/json');

    if (!request.url.includes('auth')) {
      const authToken: string = this.authenticationService.getAuthToken();

      headers = headers.append('Authorization', authToken);
    }

    return request.clone({
      headers,
    });
  }
}
