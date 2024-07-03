import { createSelector } from '@ngrx/store';

import { AppState, ConfigurationState } from '../state.model';

// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
const state = (state: AppState) => state.configurationState;

// eslint-disable-next-line @typescript-eslint/typedef
export const getLoadingStatus = createSelector(state, (state: ConfigurationState) => state.loadingStatus);

// eslint-disable-next-line @typescript-eslint/typedef
export const getServicesList = createSelector(state, (state: ConfigurationState) => state.servicesList);
