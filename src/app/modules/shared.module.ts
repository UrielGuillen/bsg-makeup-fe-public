import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinutesToHoursPipe } from '../pipes/minutes-to-hours.pipe';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';

@NgModule({
  declarations: [
    MinutesToHoursPipe,
    TimeAgoPipe,
  ],
  exports: [
    MinutesToHoursPipe,
    TimeAgoPipe,
  ],
  imports: [
    CommonModule,
  ],
})
export class SharedModule { }
