import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import * as L from 'leaflet';
import { MapMarkers, MapPoint } from '../../@types/map-point.types';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-map',
  template: `
    <div
      style="margin-bottom: 10px; display: flex; gap: 10px; flex-wrap: wrap;justify-content: center;    margin: 10px;"
    >
      <button mat-raised-button color="primary" (click)="toggleMarking()">
        {{ isMarkingActive ? 'Desativar marcação' : 'Ativar marcação' }}
      </button>

      <button mat-raised-button color="warn" (click)="clearPoints()">
        Limpar pontos
      </button>
      <mat-form-field appearance="fill">
        <mat-label>Estilo do Mapa</mat-label>
        <mat-select
          [(value)]="selectedStyle"
          (selectionChange)="changeMapStyle()"
        >
          <mat-option *ngFor="let key of mapStyleKeys" [value]="key">
            {{ mapStyles[key].name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div
      #map
      [ngStyle]="{ cursor: isMarkingActive ? 'crosshair' : 'grab' }"
      style="height: 400px; margin: 20px 0; border: 1px solid #ccc; border-radius: 8px;"
    ></div>
  `,
  styles: ``,
  standalone: true,
  imports: [MatButtonModule, CommonModule,MatButtonModule, MatSelectModule, MatFormFieldModule],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;
  protected mapPoints: MapPoint[] = [];
  private pointIdCounter = 0;
  private map!: L.Map;
  private markers: MapMarkers[] = [];
  private polyline: L.Polyline | null = null;
  protected isMarkingActive = false;
  protected selectedStyle: keyof typeof this.mapStyles = 'default';

  
  protected mapStyles = {
    default: {
      name: 'Padrão',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    satellite: {
      name: 'Satélite (Esri)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles © Esri, i-cubed, USDA, USGS, AEX, GeoEye, etc.',
    },
    dark: {
      name: 'Escuro (CartoDB)',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB',
    },
  } as const;;
  protected mapStyleKeys = Object.keys(this.mapStyles) as (keyof typeof this.mapStyles)[];

  private tileLayer!: L.TileLayer;

  private customIcon = L.icon({
    iconUrl: 'assets/pin.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  private homeIcon = L.icon({
    iconUrl: 'assets/home.png',
    iconSize: [32, 32],
    iconAnchor: [0, 32],
    popupAnchor: [0, -32],
  });
  async ngAfterViewInit() {
    const mylocation = await this.getCurrentLocation();

    console.log('mylocation', mylocation);

    this.map = L.map(this.mapElement.nativeElement).setView(
      [mylocation.lat, mylocation.lng],
      13
    );

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; OpenStreetMap contributors',
    // }).addTo(this.map);
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    //   attribution: '&copy; CartoDB'
    // }).addTo(this.map);
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    // attribution: '&copy; CartoDB'
    // }).addTo(this.map);
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, etc.',
        maxZoom: 19,
      }
    ).addTo(this.map);

    L.marker([mylocation.lat, mylocation.lng], {
      icon: this.homeIcon,
    })
      .addTo(this.map)
      .bindTooltip('Você')
      .bindPopup('Você está aqui!')
      .openPopup();
    this.map.on('click', (e: any) => {
      if (!this.isMarkingActive) return;

      const { lat, lng } = e.latlng;
      this.addPoint(lat, lng);
    });
  }
  private async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erro ao obter localização', error);
          // Pode usar uma localização padrão se o usuário negar
          resolve({ lat: -22.9, lng: -43.2 }); // Rio de Janeiro como fallback
        }
      );
    });
  }

  addPoint(lat: number, lng: number) {
    const id = this.pointIdCounter++;
    const point: MapPoint = { id, lat, lng };
    this.mapPoints.push(point);

    const marker = L.marker([lat, lng], {
      icon: this.customIcon,
      draggable: true,
    })
      .addTo(this.map)
      .bindTooltip(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);

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
      const confirmDelete = confirm('Deseja deletar este ponto?');
      if (!confirmDelete) return;
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

  changeMapStyle() {
  if (this.tileLayer) {
    this.map.removeLayer(this.tileLayer);
  }

  const style = this.mapStyles[this.selectedStyle];

  this.tileLayer = L.tileLayer(style.url, {
    attribution: style.attribution,
  }).addTo(this.map);
}
}
