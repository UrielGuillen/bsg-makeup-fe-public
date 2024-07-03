import { from, of } from 'rxjs';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  RoutesRecognized,
} from '@angular/router';

// eslint-disable-next-line @typescript-eslint/typedef
export const MOCK_ROUTER = {
  navigate: jasmine.createSpy('navigate'),
  events: of(new NavigationEnd(1, '/', '/')),
};

// eslint-disable-next-line @typescript-eslint/typedef
export const MOCK_HEADER_ROUTER = {
  navigate: jasmine.createSpy('navigate'),
  events: from([
    new NavigationStart(1, '/'),
    new RoutesRecognized(2, '/', '/', {
      url: '', toString(): string {
        return '';
      },
      // @ts-expect-error there's no need to implement all parameters since only the above are used
      root: { firstChild: { data: { 'headerTitle' : 'Test Header' } } } }),
    new NavigationCancel(3, '/', '/'),
  ]),
};
