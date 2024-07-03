import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, tap } from 'rxjs';

import { AppState } from '../state.model';
import { LoadingStatus } from '../../app/enums/loading-status.enum';
import { CatalogService } from '../../app/services/core/catalog.service';
import { ServicesCatalog } from '../../app/interfaces/services-catalog.interface';

import { RequestServicesCatalog, SetLoadingStatus, SetServicesCatalog } from './configuration-actions';

@Injectable()
export class ConfigurationEffects {
  // eslint-disable-next-line @typescript-eslint/typedef
  getServicesCatalog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestServicesCatalog),
      tap(() => this.store.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.InProgress }))),
      switchMap(() => this.catalogService.getServicesCatalog()),
      map((servicesCatalog: Array<ServicesCatalog>) => {
        this.store.dispatch(SetServicesCatalog({ response: servicesCatalog }));

        return SetLoadingStatus({ loadingStatus: LoadingStatus.Completed });
      }),
      catchError((_, caught) => {
        this.store.dispatch(SetLoadingStatus({ loadingStatus: LoadingStatus.Error }));

        return caught;
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private catalogService: CatalogService,
  ) {}
}
