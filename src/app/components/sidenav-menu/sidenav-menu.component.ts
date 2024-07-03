import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { environment as env } from '../../../environments/environment';
import { AppState } from '../../../state/state.model';
import { RequestSignOut } from '../../../state/authentication/authentication-actions';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: [ './sidenav-menu.component.scss' ],
})
export class SidenavMenuComponent {
  public readonly logoUrl: string = env.assets.prefix + env.assets.icons + '/LogoMedium.svg';

  @Input() selectedLanguage!: string;
  @Input() sidenavPosition: string = 'start';

  @Output() closeSideNavMenuEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() setLanguageEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private store$: Store<AppState>) {}

  public closeSideNavMenu(): void {
    this.closeSideNavMenuEvent.emit();
  }

  public changeLanguage(event: MatButtonToggleChange): void {
    this.selectedLanguage = event.value as string;
    this.setLanguageEvent.emit(this.selectedLanguage);
  }

  public signOut(): void {
    this.store$.dispatch(RequestSignOut());
    this.closeSideNavMenu();
  }
}
