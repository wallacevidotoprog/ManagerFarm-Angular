import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { CepService } from '../../../api/external/services/cep.service';
import { MapPoint } from '../../@types/map-point.types';
import { ufs } from '../../common/arrays-default';
import { MaskDirective } from '../../directive/mask.directive';
import {
  BaseModalComponent,
  ModalBase,
} from '../../shared/components/base-modal/base-modal.component';
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-register-farm',
  imports: [
    BaseModalComponent,
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MaskDirective,
    MatIconModule,
    MatStepperModule,
    MaskDirective,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MapComponent
],
  templateUrl: './register-farm.component.html',
  styleUrl: './register-farm.component.scss',
})
export class RegisterFarmComponent extends ModalBase {
 
  protected uf = ufs;

  private cepService: CepService = inject(CepService);
  onSubmit(_t217: MatStepper) {
    throw new Error('Method not implemented.');
  }
  protected fb: FormBuilder = inject(FormBuilder);

  protected mapPoints: MapPoint[] = [];

  protected formProperty = this.fb.group({
    cnpj: ['', Validators.required],
    company: ['', Validators.required],
    name: ['', Validators.required],
    size: ['', Validators.required],
    status: ['', Validators.required],
    description: ['', Validators.required],
  });

  protected formAddress = this.fb.group({
    cep: ['', Validators.required],
    place: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    uf: ['', [Validators.required, Validators.maxLength(2)]],
  });

  protected formPoints = this.fb.group({
    mapPoints: ['', Validators.required],
  });

  setAddressForm(addressForm: FormGroup) {
    this.formAddress = addressForm;
  }
  isLoadApi: unknown;

  protected searchCEP() {
    const cep = this.formAddress.get('cep')?.value;
    console.log('cep', cep);

    if (cep?.length === 8) {
      this.cepService.searchCep(cep.replace(/\D/g, '')).subscribe((data) => {
        if (!data.erro) {
          this.formAddress.patchValue({
            place: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            uf: data.uf,
          });
        }
      });
    }
  }

  protected onMapPointsReturn($event: MapPoint[]) {
    this.mapPoints = $event;
  }
}
