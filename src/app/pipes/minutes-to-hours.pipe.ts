import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'minutesToHours',
})
export class MinutesToHoursPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(fullTime: number): string {
    const hours: number = Math.floor(fullTime / 60);
    const minutes: number = fullTime % 60;

    if (hours === 0 && minutes > 0) {
      const suffix: string = this.translateService.instant('SCHEDULE.MINUTES');

      return minutes + ' ' + suffix;
    }

    const time: string = hours + ':' + minutes;
    const suffix: string = this.translateService.instant('SCHEDULE.HOURS');

    return time + ' ' + suffix;
  }
}
