import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';

import { environment } from '../../environments/environment';
import { ContactUser } from '../interfaces/contact-user.interface';
import { BaseResponse } from '../interfaces/base-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactUserService {
  private readonly prefixUrl: string = environment.api.url;
  private readonly contactUserUrl: string = this.prefixUrl + '/contact';

  constructor(protected http: HttpClient) {}

  public createContactUser(contactUser: ContactUser): Observable<BaseResponse> {
    const createContactUserUrl: string = this.contactUserUrl + '/user';
    return this.http.post<BaseResponse>(createContactUserUrl, contactUser).pipe(take(1));
  }
}
