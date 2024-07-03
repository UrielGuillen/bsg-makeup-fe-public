import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MOCK_INITIAL_STATE } from '../../mocks/mock-initial-state';
import { MinutesToHoursPipe } from '../../pipes/minutes-to-hours.pipe';
import { AppMaterialModule } from '../../modules/app.material.module';
import { getServicesList } from '../../../state/configuration/configuration-selectors';
import { MOCK_SERVICES_CATALOG } from '../../mocks/mock-services-catalog';

import { ServicesComponent } from './services.component';

describe('ServicesComponent', () => {
  let store: MockStore;
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ServicesComponent,
        MinutesToHoursPipe,
      ],
      imports: [
        AppMaterialModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        provideMockStore({ initialState: MOCK_INITIAL_STATE }),
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();
  });

  beforeEach( () => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(getServicesList, MOCK_SERVICES_CATALOG);

    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();

    tick(2000);

    fixture.whenStable();

    expect(component).toBeTruthy();
  }));
});
