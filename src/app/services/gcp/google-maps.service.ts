import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMap } from '@angular/google-maps';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {

  private readonly mapOptions: google.maps.MapOptions = {
    center: { lat: 19.5215975, lng: -99.2214472 },
    zoom: 15,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false,
  };
  private loader!: Loader;
  private circleDefaultOptions: google.maps.CircleOptions = {
    strokeColor: '#ddc0b4',
    strokeOpacity: 0.9,
    strokeWeight: 2,
    fillColor: '#ddc0b4',
    fillOpacity: 0.2,
    center: this.mapOptions.center,
    radius: 400,
  };

  constructor() {}

  public initMap(): Promise<typeof google> {
    this.loader = new Loader({
      apiKey: environment.gcp.mapsApiKey,
      version: 'weekly',
    });

    return this.loader.load();
  }

  public initCircle(circleOptions: google.maps.CircleOptions): void {
    new google.maps.Circle(circleOptions);
  }

  public getMapOptions(): google.maps.MapOptions {
    return this.mapOptions;
  }

  public getMapCircleOptions(map: GoogleMap | undefined): google.maps.CircleOptions {
    return {
      ...this.circleDefaultOptions,
      map: map ? map.googleMap : undefined,
    };
  }
}
