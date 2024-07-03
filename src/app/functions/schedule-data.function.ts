import { Navigation, Router } from '@angular/router';

import { ScheduleData } from '../interfaces/schedule-data.interface';

export function getScheduleData(router: Router): ScheduleData | null {
  const currentNavigation: Navigation | null = router.getCurrentNavigation();

  if (currentNavigation) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scheduleData: { [p: string]: any } | undefined = currentNavigation.extras.state;

    if (scheduleData) {
      return scheduleData as ScheduleData;
    }

    return null;
  }

  return null;
}
