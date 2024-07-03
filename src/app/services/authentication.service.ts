import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../environments/environment';
import { SignInUser } from '../interfaces/sign-in-user.interface';
import { SignUpUser } from '../interfaces/sign-up-user.interface';
import { TokenUserResponse } from '../interfaces/token-response.interface';
import { DecodedToken } from '../interfaces/user-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly baseUrl: string = environment.api.url + '/auth';

  constructor(protected http: HttpClient) {}

  public signInUser(body: SignInUser): Observable<TokenUserResponse> {
    const signInUserUrl: string = this.baseUrl + '/sign-in';

    return this.http.post<TokenUserResponse>(signInUserUrl, body).pipe(take(1));
  }

  public signUpUser(body: SignUpUser): Observable<TokenUserResponse> {
    const signUpUserUrl: string = this.baseUrl + '/sign-up';

    return this.http.post<TokenUserResponse>(signUpUserUrl, body).pipe(take(1));
  }

  public signOutUser(): void {
    localStorage.removeItem('Authorization');
  }

  public getAuthToken(): string {
    const token: string | null = localStorage.getItem('Authorization');

    return token ? token : '';
  }

  public isTypeUser(): boolean {
    return this.getDataFromToken('userRole') === 'user';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getDataFromToken(property: keyof DecodedToken): any {
    const decodedToken: DecodedToken = jwtDecode(this.getAuthToken()) as DecodedToken;

    return decodedToken[property];
  }

  public saveToken(response: TokenUserResponse): void {
    if (response.success) {
      localStorage.setItem('Authorization', response.response);
    }
  }
}
