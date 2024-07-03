import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import { ConfigurationState } from '../state.model';
import { LoadingStatus } from '../../app/enums/loading-status.enum';
import { ServicesCatalog } from '../../app/interfaces/services-catalog.interface';
import { environment } from '../../environments/environment';

import * as ConfigurationActions from './configuration-actions';

const INITIAL_STATE: ConfigurationState = {
  loadingStatus: LoadingStatus.Completed,
  servicesList: [],
};

export const configurationReducer: ActionReducer<ConfigurationState, Action> = createReducer(
  INITIAL_STATE,
  on(ConfigurationActions.SetLoadingStatus, (state: ConfigurationState, payload: { loadingStatus: LoadingStatus }) => ({
    ...state,
    loadingStatus: payload.loadingStatus,
  })),
  on(ConfigurationActions.SetServicesCatalog, (state: ConfigurationState, payload: { response: Array<ServicesCatalog> }) => {
    const services: Array<ServicesCatalog> = payload.response.map((service: ServicesCatalog) => {
      return {
        ...service,
        description: environment.assets.prefix + service.description + service.id + '.webp',
      };
    });

    return {
      ...state,
      servicesList: services,
    };
  }),
);
