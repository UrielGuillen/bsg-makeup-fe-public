import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { ServicesCatalog } from '../../interfaces/services-catalog.interface';
import { AppState } from '../../../state/state.model';
import { getServicesList } from '../../../state/configuration/configuration-selectors';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: [ './services.component.scss' ],
})
export class ServicesComponent implements OnInit, OnDestroy {
  public servicesList: Array<ServicesCatalog> = [];
  public loadingElements: boolean = true;

  private subscriptions: Array<Subscription> = [];

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.initServiceCatalogListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public trackByServiceId(index: number, service: ServicesCatalog): string {
    return service.id;
  }

  public groupServicesBy(groupBy: string): Array<ServicesCatalog> {
    return this.servicesList.reduce((groupedElements: Array<ServicesCatalog>, service: ServicesCatalog) => {
      if (service.group === groupBy) {
        groupedElements.push(service);
      }

      return groupedElements;
    }, []);
  }

  private initServiceCatalogListener(): void {
    this.subscriptions.push(
      this.store$.select(getServicesList).subscribe((servicesList: Array<ServicesCatalog>) => {
        this.servicesList = servicesList;
        this.loadingElements = false;
      }),
    );
  }

}
