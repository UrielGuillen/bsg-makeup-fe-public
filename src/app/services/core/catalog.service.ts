import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, take } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ServicesCatalog, ServicesCatalogResponse } from '../../interfaces/services-catalog.interface';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly prefixUrl: string = environment.api.url;

  constructor(protected http: HttpClient) {}

  public getServicesCatalog(): Observable<Array<ServicesCatalog>> {
    const servicesCatalogUrl: string = this.prefixUrl + '/catalog/services';

    return this.http.get<ServicesCatalogResponse>(servicesCatalogUrl).pipe(
      take(1),
      map((response: ServicesCatalogResponse) => {
        let singleList: Array<ServicesCatalog> = [];
        singleList = singleList.concat(response.response.servicesCatalog);
        singleList = singleList.concat(response.response.microCatalog);

        return singleList;
      }),
    );
  }
}
