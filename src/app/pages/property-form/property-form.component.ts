import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MapPoint } from '../../@types/map-point.types';
import { MapComponent } from '../../components/map/map.component';

enum PropertyStatus {
  NONE = 'NONE',
  AVAILABLE = 'DISPONÍVEL',
  SOLD = 'VENDIDA',
  RENTED = 'ALUGADA',
}
@Component({
  selector: 'app-property-form',
  standalone: true,
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MapComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonToggleModule,
  ],
})
export class PropertyFormComponent implements OnInit {
  @ViewChild('mapComp') mapComponent!: MapComponent;

  mapPoints: MapPoint[] = [];

  private http: HttpClient = inject(HttpClient);
  propertyForm!: FormGroup;
  statusOptions = Object.values(PropertyStatus);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.propertyForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      size: [null, Validators.required],
      mapPoints: [this.mapPoints, Validators.required], // Pode ser melhorado com textarea ou JSON editor
      ownerId: ['', Validators.required],
      userId: ['', Validators.required],
      status: [PropertyStatus.NONE, Validators.required],
      description: [''],
    });
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      console.log('Form data:', this.propertyForm.value);
    }
    return;

    this.http
      .post('http://localhost:3000/property', {
        name: 'this.name',
        location: 'this.location',
        size: 5,
        userId: '095abb78-66e2-44d1-9101-8c136b492f34',
        ownerId: '095abb78-66e2-44d1-9101-8c136b492f34',
        mapPoints: this.mapPoints,
      })
      .subscribe({
        next: () => alert('Propriedade salva!'),
        error: () => alert('Erro ao salvar!'),
      });
  }

  onMapPointsReturn($event: MapPoint[]) {
    this.mapPoints = $event;
  }
  onTabChange(event: any): void {
    if (event.index === 2) { 
      this.mapComponent.invalidateMapSize();
    }
  }
}
