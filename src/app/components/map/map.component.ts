import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { area, polygon } from '@turf/turf';
import * as L from 'leaflet';
import { MapMarkers, MapPoint } from '../../@types/map-point.types';

@Component({
  selector: 'app-map',
  template: `
    <div
      style="
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin: 16px auto;
    max-width: 100%;
  "
    >
    
      <button mat-fab extended color="primary" (click)="toggleMarking()">
        <mat-icon>edit_location</mat-icon>
        {{ isMarkingActive ? 'Desativar marcação' : 'Ativar marcação' }}
      </button>

      <button mat-fab extended color="warn" (click)="clearPoints()">
        <mat-icon>delete_forever</mat-icon>
        Limpar pontos
      </button>

      <div
        class="map-style-select"
        (click)="toggleDropdown()"
        tabindex="0"
        (blur)="dropdownOpen = false"
      >
        <span class="select-button">
          <span class="material-icons option-icon">
            {{ mapStyles[selectedStyle].icon }}
          </span>
          {{ mapStyles[selectedStyle].name }}
        </span>
        <span class="material-icons arrow-icon">&#9662;</span>

        <ul class="options-dropdown" *ngIf="dropdownOpen">
          <li
            *ngFor="let key of mapStyleKeys"
            (click)="selectStyle(key)"
            [class.selected]="key === selectedStyle"
          >
            <span class="material-icons option-icon">
              {{ mapStyles[key].icon }}
            </span>
            {{ mapStyles[key].name }}
          </li>
        </ul>
      </div>
    </div>

    <div
      #map
      [ngStyle]="{ cursor: isMarkingActive ? 'crosshair' : 'grab' }"
      style="height: 600px; margin: 20px 0; border: 1px solid #ccc; border-radius: 8px;"
    ></div>
  `,
  styles: `
  button{
width: 200px;
  }
  .map-style-select {
  position: relative;
  display: inline-block;
  user-select: none;
  outline: none;
  width: 200px;
  font-family: Roboto, Arial, sans-serif;
  
}

.select-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  background-color: #d7e3ff;
  color: #00458f;
  padding: 8px 16px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-family: Roboto, Arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  height: 38px;
  user-select: none;
  
}

.select-button:hover {
  background-color:rgb(198, 214, 252);
  box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);;
}

.option-icon {
  font-size: 22px;
  line-height: 1;
}

.arrow-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
  color: #00458f;
}

.options-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  border-radius: 8px;
  margin: 4px 0 0 0;
  padding: 4px 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.options-dropdown li {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #333;
  transition: background-color 0.2s ease;
  user-select: none;
}

.options-dropdown li.selected,
.options-dropdown li:hover {
  background-color: #d7e3ff;
  color: #00458f;
}

.options-dropdown li .option-icon {
  font-size: 20px;
}
`,
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
  ],
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;
  protected mapPoints: MapPoint[] = [];
  public returnPoints = output<MapPoint[]>();
  public returnSize = output<number>();
  private pointIdCounter = 0;
  private map!: L.Map;
  private markers: MapMarkers[] = [];
  private polyline: L.Polyline | null = null;
  protected isMarkingActive = false;
  protected selectedStyle: keyof typeof this.mapStyles = 'default';
  dropdownOpen = false;
  hectares: string = '0 ha' ;

  protected mapStyles = {
    default: {
      name: 'Padrão',
      icon: 'map',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    satellite: {
      name: 'Satélite (Esri)',
      icon: 'satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles © Esri, i-cubed, USDA, USGS, AEX, GeoEye, etc.',
    },
    dark: {
      name: 'Escuro (CartoDB)',
      icon: 'dark_mode',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB',
    },
  } as const;
  protected mapStyleKeys = Object.keys(
    this.mapStyles
  ) as (keyof typeof this.mapStyles)[];

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
    this.map = L.map(this.mapElement.nativeElement).setView(
      [mylocation.lat, mylocation.lng],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    //   attribution: '&copy; CartoDB'
    // }).addTo(this.map);
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    // attribution: '&copy; CartoDB'
    // }).addTo(this.map);
    // L.tileLayer(
    //   'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    //   {
    //     attribution:
    //       'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, etc.',
    //     maxZoom: 19,
    //   }
    // ).addTo(this.map);

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
        marker.bindTooltip(
          `Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}`
        );
        this.drawPolyline();
      }
      this.onEventEmitPoints();
    });

    marker.on('click', () => {
      const confirmDelete = confirm('Deseja deletar este ponto?');
      if (!confirmDelete) return;
      this.removePoint(id);
    });

    this.markers.push({ id, marker });
    this.drawPolyline();
    this.onEventEmitPoints();
  }

  removePoint(id: number) {
    const markerObj = this.markers.find((m) => m.id === id);
    if (markerObj) {
      this.map.removeLayer(markerObj.marker);
      this.markers = this.markers.filter((m) => m.id !== id);
    }
    this.mapPoints = this.mapPoints.filter((p) => p.id !== id);
    this.drawPolyline();
    this.onEventEmitPoints();
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
    this.onEventEmitPoints();
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

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectStyle(key: keyof typeof this.mapStyles) {
    this.selectedStyle = key;
    this.dropdownOpen = false;
    this.changeMapStyle();
    this.toggleDropdown();
  }

  onEventEmitPoints() {
  const hectares = this.getPolygonAreaInHectares();
    // this.hectares = hectares.toFixed(2);


  this.returnPoints.emit(this.mapPoints);
  this.returnSize.emit(hectares);
  }

  public invalidateMapSize(): void {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 100); // pequeno delay para garantir renderização
    }
  }

  getPolygonAreaInHectares(): number {
    if (this.mapPoints.length < 3) return 0;

    // Converte para GeoJSON format
    const coordinates = [
      [
        ...this.mapPoints.map((p) => [p.lng, p.lat]),
        [this.mapPoints[0].lng, this.mapPoints[0].lat],
      ], // fecha o polígono
    ];

    const poly = polygon(coordinates);
    const areaInSqMeters = area(poly);

    return areaInSqMeters; // metros quadrados → hectares
  }

  onGetSize(){

  }
  onGetPoint(){

  }
}
