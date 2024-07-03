import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { appointmentsReducer } from '../../state/appointments/appointments-reducers';
import { AppointmentsEffects } from '../../state/appointments/appointments-effects';
import { environment } from '../../environments/environment';
import { configurationReducer } from '../../state/configuration/configuration-reducers';
import { ConfigurationEffects } from '../../state/configuration/configuration-effects';
import { authenticationReducer } from '../../state/authentication/authentication-reducers';
import { AuthenticationEffects } from '../../state/authentication/authentication-effects';
import { ImageUploadService } from '../services/aws/image-upload.service';

const appReducers: ActionReducerMap<object> = {
  appointmentsState: appointmentsReducer,
  configurationState: configurationReducer,
  authenticationState: authenticationReducer,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appEffects: Array<any> = [ AppointmentsEffects, ConfigurationEffects, AuthenticationEffects ];

@NgModule({
  imports: [
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(appEffects),
    !environment.production
      ? StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: true,
        trace: true,
      })
      : [],
  ],
  providers: [ ImageUploadService ],
})
export class AppStoreModule {}
