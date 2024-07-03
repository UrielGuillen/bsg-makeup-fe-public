import { createAction, props } from '@ngrx/store';

import { LoadingStatus } from '../../app/enums/loading-status.enum';
import { ServicesCatalog } from '../../app/interfaces/services-catalog.interface';

enum ConfigurationActions {
  SetLoadingStatus = '[Set] Set loading status',
  RequestServicesCatalog = '[Request] Request services catalog',
  SetServicesCatalog = '[Set] Set services catalog',
}

// eslint-disable-next-line @typescript-eslint/typedef
export const SetLoadingStatus = createAction(ConfigurationActions.SetLoadingStatus, props<{ loadingStatus: LoadingStatus }>());

// eslint-disable-next-line @typescript-eslint/typedef
export const RequestServicesCatalog = createAction(ConfigurationActions.RequestServicesCatalog);

// eslint-disable-next-line @typescript-eslint/typedef
export const SetServicesCatalog = createAction(ConfigurationActions.SetServicesCatalog, props<{ response: Array<ServicesCatalog> }>());
