import { Component, input } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import 'leaflet-routing-machine';
declare let L: any;

interface LatLong {
  lat: number;
  lng: number;
}
export interface MapRoute {
  start: LatLong;
  end: LatLong;
}

@Component({
  selector: 'feature-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  label = input<string | undefined>();
  mapRoute = input.required<MapRoute>();
  options: MapOptions = {
    layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })],
    zoom: 10,
    center: latLng(30.290111, 57.06753),
  };
  map?: L.Map;

  onMapReady(map: L.Map) {
    this.map = map;
    const route = this.mapRoute();
    L.Routing.control({
      waypoints: [L.latLng(route.start.lat, route.start.lng), L.latLng(route.end.lat, route.end.lng)],
      lineOptions: {
        styles: [{ color: 'blue', weight: 3 }],
      },
      routeWhileDragging: true,
      createMarker: (i: number, waypoint: any) =>
        L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl: '/assets/base/images/truck.svg',
            iconSize: [20, 20],
            iconAnchor: [16, 16],
          }),
        }),
    }).addTo(this.map);
  }
}
