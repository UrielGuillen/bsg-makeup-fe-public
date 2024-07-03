import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '../../../state/state.model';
import { SetHourSelected } from '../../../state/appointments/appointments-actions';
import { NotificationCentreService } from '../../services/notification-centre.service';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: [ './bottom-navigation.component.scss' ],
})
export class BottomNavigationComponent implements OnInit, OnDestroy {
  public currentUrl: string = '/';
  public noNewNotificationIcon: string = 'notifications';
  public newNotificationIcon: string = 'notifications_active';
  public currentNotificationIcon: string = this.noNewNotificationIcon;
  public showNewNotificationsIndicator: boolean = false;

  private subscriptions: Array<Subscription> = [];

  @Output() openSideNavEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private store$: Store<AppState>,
    private router: Router,
    private notificationCentreService: NotificationCentreService,
  ) {}

  ngOnInit(): void {
    this.initRouteChangeListener();
    this.initNotificationsListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  public openSideNav(): void {
    this.openSideNavEvent.emit();
  }

  public goToSchedule(): void {
    this.store$.dispatch(SetHourSelected({ hour: { id: 0, hour: '' } }));
    this.router.navigate([ '/', 'schedule' ]);
  }

  private initRouteChangeListener(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.currentUrl = route.url;
      }
    });
  }

  private initNotificationsListener(): void {
    this.subscriptions.push(
      this.notificationCentreService.getNewNotifications().subscribe((newNotifications: boolean) => {
        if (newNotifications && !this.showNewNotificationsIndicator) {
          this.initNewNotificationAlert();
        }

        if (!newNotifications && this.showNewNotificationsIndicator) {
          this.showNewNotificationsIndicator = false;
        }
      }),
    );
  }

  private initNewNotificationAlert(): void {
    let seconds: number = 7;

    // eslint-disable-next-line angular/interval-service
    const timer: NodeJS.Timeout = setInterval(() => {

      if (seconds % 2 === 0) {
        this.currentNotificationIcon = this.noNewNotificationIcon;
      } else {
        this.currentNotificationIcon = this.newNotificationIcon;
      }

      seconds--;

      if (seconds < 0) {
        this.showNewNotificationsIndicator = true;
        clearInterval(timer);
      }
    }, 1000);
  }
}
