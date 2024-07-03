import { Pipe, PipeTransform } from '@angular/core';
import { format, formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: number): string {
    const timeDifference: number = Date.now() - new Date(value).getTime();
    const daysDifference: number = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference > 9) {
      return format(value, 'dd MMM yy HH:mm');
    } else {
      return formatDistanceToNow(value, { includeSeconds: true, addSuffix: true });
    }
  }
}
