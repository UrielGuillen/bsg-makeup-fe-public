import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonToggle } from '@angular/material/button-toggle';

import { MOCK_ACTIVATED_ROUTE } from '../../mocks/mock-activated-route';
import { AppMaterialModule } from '../../modules/app.material.module';
import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { RequestSignOut } from '../../../state/authentication/authentication-actions';

import { SidenavMenuComponent } from './sidenav-menu.component';

describe('SidenavMenuComponent', () => {
  let store: MockStore;
  let component: SidenavMenuComponent;
  let fixture: ComponentFixture<SidenavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavMenuComponent ],
      imports: [
        AppMaterialModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        provideMockStore({ initialState: MOCK_INITIAL_STATE }),
        { provide: ActivatedRoute, useValue: MOCK_ACTIVATED_ROUTE },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SidenavMenuComponent);

    component = fixture.componentInstance;
    component.selectedLanguage = 'es';

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.selectedLanguage).toBe('es');
  });

  it('should emit to close the sidenav', () => {
    spyOn(component.closeSideNavMenuEvent, 'emit');

    component.closeSideNavMenu();

    fixture.detectChanges();

    expect(component.closeSideNavMenuEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should change the language properly', () => {
    spyOn(component.setLanguageEvent, 'emit');

    component.changeLanguage({ value: 'en', source: {} as MatButtonToggle });

    fixture.detectChanges();

    expect(component.selectedLanguage).toBe('en');
    expect(component.setLanguageEvent.emit).toHaveBeenCalledWith('en');
  });

  it('should dispatch sign out action', () => {
    spyOn(store, 'dispatch');

    component.signOut();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(RequestSignOut());
  });
});
