import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserData, UserDataResponse } from '../interfaces/user-data.interface';
import { BaseResponse } from '../interfaces/base-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly prefixUrl: string = environment.api.url + '/user';

  constructor(protected http: HttpClient) {}

  public getUserPublicData(): Observable<UserDataResponse> {
    const getUserDataUrl: string = this.prefixUrl + '/get-public-data';

    return this.http.get<UserDataResponse>(getUserDataUrl);
  }

  public updateProfileImage(profilePhotoUrl: string): Observable<BaseResponse> {
    const updateProfileImageUrl: string = this.prefixUrl + '/update-profile-image';

    return this.http.put<BaseResponse>(updateProfileImageUrl, profilePhotoUrl).pipe(take(1));
  }

  public updateBasicBasicData(userData: Partial<UserData>): Observable<UserDataResponse> {
    const updateBasicDataUrl: string = this.prefixUrl + '/update-basic-data';

    return this.http.put<UserDataResponse>(updateBasicDataUrl, userData).pipe(take(1));
  }
}
