import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationCancel, NavigationStart, Router, RoutesRecognized } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../state/state.model';
import { environment, environment as env } from '../../../environments/environment';
import { getUserProfileImage, isSessionOpened } from '../../../state/authentication/authentication-selectors';
import { RequestSignOut } from '../../../state/authentication/authentication-actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public readonly homeViewPatterns: Array<string> = [ '/', '/home', '/feed' ];
  public readonly logoUrl: string = env.assets.prefix + env.assets.icons + '/LogoSmall.svg';
  public readonly signInUrl: string = '/sign-in';
  public readonly signUpUrl: string = '/sign-up';
  public isHome: boolean = true;
  public isSignProcess: boolean = false;
  public isUserAuthenticated: boolean = false;
  public headerTitle: string = '';
  public photoUrl!: string;

  private subscriptions: Array<Subscription> = [];

  @Input() isInternalView: boolean = false;

  @Output() openSideNavEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private store$: Store<AppState>,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.initPathListener();
    this.initAuthenticationListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public openSideNav(): void {
    this.openSideNavEvent.emit();
  }

  public goBack(): void {
    this.location.back();
  }

  public signOutUser(): void {
    this.store$.dispatch(RequestSignOut());
  }

  private initPathListener(): void {
    this.subscriptions.push(
      this.router.events.subscribe((data) => {
        if (data instanceof NavigationStart) {
          this.isSignProcess = data.url.includes(this.signInUrl) || data.url.includes(this.signUpUrl);
          this.isHome = this.homeViewPatterns.includes(data.url);
        }
        if (data instanceof RoutesRecognized) {
          if (data.state.root.firstChild?.data) {
            this.headerTitle = data.state.root.firstChild?.data['headerTitle'];
          }
        }
        if (data instanceof NavigationCancel) {
          this.goBack();
        }
      }),
    );
  }

  private initAuthenticationListener(): void {
    this.subscriptions.push(
      this.store$
        .select(isSessionOpened)
        .pipe(tap((isSessionOpened: boolean) => isSessionOpened && this.initProfileImageListener()))
        .subscribe((isSessionOpened: boolean) => (this.isUserAuthenticated = isSessionOpened)),
    );
  }

  private initProfileImageListener(): void {
    this.subscriptions.push(
      this.store$.select(getUserProfileImage).subscribe((profileUrl: string | null) => {
        if (profileUrl) {
          this.photoUrl = environment.profilePhotos.url + profileUrl;
        }
      }),
    );
  }
}
