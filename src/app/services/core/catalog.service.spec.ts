import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ServicesCatalog, ServicesCatalogResponse } from '../../interfaces/services-catalog.interface';
import { MOCK_SERVICES_CATALOG } from '../../mocks/mock-services-catalog';

import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ CatalogService ],
    });

    service = TestBed.inject(CatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the catalog list', () => {
    const fakeResponse: ServicesCatalogResponse = {
      success: true,
      message: 'All good',
      response: {
        servicesCatalog: MOCK_SERVICES_CATALOG,
        microCatalog: [],
      },
    };

    service.getServicesCatalog().subscribe((response: Array<ServicesCatalog>) => {
      expect(response.length).toBe(3);
    });

    const request: TestRequest = httpMock.expectOne('http://localhost:8080/services/api/v1/catalog/services');

    expect(request.request.method).toBe('GET');

    request.flush(fakeResponse);
  });
});
