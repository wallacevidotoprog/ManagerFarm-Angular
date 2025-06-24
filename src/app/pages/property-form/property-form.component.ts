import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { MapComponent } from "../../components/map/map.component";

interface MapPoint {
  id: number;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-property-form',
  standalone: true,
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, MapComponent,MapComponent],
})
export class PropertyFormComponent implements AfterViewInit {
  name = '';
  location = '';
  size = 0;
  userId = '';
  mapPoints: MapPoint[] = [];

  private http: HttpClient = inject(HttpClient);
  private pointIdCounter = 0;

  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;
  private map!: L.Map;

  private markers: { id: number; marker: L.Marker }[] = [];
  private polyline: L.Polyline | null = null;

  isMarkingActive = false;

  customIcon = L.icon({
    iconUrl: 'assets/pin.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  ngAfterViewInit() {
    this.map = L.map(this.mapElement.nativeElement).setView([-22.9, -43.2], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      if (!this.isMarkingActive) return;

      const { lat, lng } = e.latlng;
      this.addPoint(lat, lng);
    });
  }

  addPoint(lat: number, lng: number) {
    const id = this.pointIdCounter++;
    const point: MapPoint = { id, lat, lng };
    this.mapPoints.push(point);

    const marker = L.marker([lat, lng], {
      icon: this.customIcon,
      draggable: true,
    }).addTo(this.map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      const p = this.mapPoints.find((p) => p.id === id);
      if (p) {
        p.lat = pos.lat;
        p.lng = pos.lng;
        this.drawPolyline();
      }
    });

    marker.on('click', () => {
      this.removePoint(id);
    });

    this.markers.push({ id, marker });
    this.drawPolyline();
  }

  removePoint(id: number) {
    const markerObj = this.markers.find((m) => m.id === id);
    if (markerObj) {
      this.map.removeLayer(markerObj.marker);
      this.markers = this.markers.filter((m) => m.id !== id);
    }
    this.mapPoints = this.mapPoints.filter((p) => p.id !== id);
    this.drawPolyline();
  }

  drawPolyline() {
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }

    if (this.mapPoints.length < 2) {
      return;
    }

    const latlngs: L.LatLngTuple[] = this.mapPoints.map((p) => [p.lat, p.lng]);
    latlngs.push([this.mapPoints[0].lat, this.mapPoints[0].lng]); // fecha o polígono

    this.polyline = L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
  }

  clearPoints() {
    this.markers.forEach((m) => this.map.removeLayer(m.marker));
    this.markers = [];
    this.mapPoints = [];
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
      this.polyline = null;
    }
  }

  toggleMarking() {
    this.isMarkingActive = !this.isMarkingActive;
  }

  submit() {
    this.http
      .post('http://localhost:3000/property', {
        name: 'this.name',
        location: 'this.location',
        size: 5,
        userId: '095abb78-66e2-44d1-9101-8c136b492f34',
        ownerId:'095abb78-66e2-44d1-9101-8c136b492f34',
        mapPoints: this.mapPoints,
      })
      .subscribe({
        next: () => alert('Propriedade salva!'),
        error: () => alert('Erro ao salvar!'),
      });
  }
}
