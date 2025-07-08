import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, inject, ViewChild } from '@angular/core';
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
import { IProperty } from '../../../api/internal/model/property.interface';
import { PropertyApiService } from '../../../api/internal/service/property.api';
import { ListKeyView } from '../../@types/default.types';
import { MapPoint } from '../../@types/map-point.types';
import {
  FarmActivityTypeList,
  PropertyStatusList,
  ufs,
} from '../../common/arrays-default';
import { SquareMetersDirective } from '../../directive/mask.-metros.directive';
import { MaskDirective } from '../../directive/mask.directive';
import {
  BaseModalComponent,
  ModalBase,
} from '../../shared/components/base-modal/base-modal.component';
import { InputChipsComponent } from '../input-chips/input-chips.component';
import { MapComponent } from '../map/map.component';
import { ToastrService } from 'ngx-toastr';
import { HttpStatus } from '../../../api/Utils/HttpStaus';

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
    MapComponent,
    MaskDirective,
    SquareMetersDirective,
    InputChipsComponent,
  ],
  templateUrl: './register-farm.component.html',
  styleUrl: './register-farm.component.scss',
})
export class RegisterFarmComponent
  extends ModalBase
  implements AfterContentInit
{
  private cepService: CepService = inject(CepService);
  private serviceProperty: PropertyApiService = inject(PropertyApiService);
  private alert: ToastrService = inject(ToastrService);

  @ViewChild('mapComp') mapComponent!: MapComponent;
  ngAfterContentInit(): void {
    // this.mapComponent.invalidateMapSize();mapp
  }
  protected uf = ufs;
  protected statusProp = PropertyStatusList;
  protected activityProp = FarmActivityTypeList;
  protected isLoadApi: boolean = false;
  protected size: number = 0;
  protected fb: FormBuilder = inject(FormBuilder);

  protected mapPoints: MapPoint[] = [];

  protected formProperty = this.fb.group({
    cnpj: ['', Validators.required],
    company: ['', Validators.required],
    name: ['', Validators.required],
    status: ['', Validators.required],
    propertyActivities: this.fb.control<ListKeyView[]>([], Validators.required),
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
    size: [0, Validators.required],
    mapPoints: this.fb.control<MapPoint[]>([], Validators.required),
  });

  protected setAddressForm(addressForm: FormGroup) {
    this.formAddress = addressForm;
  }

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

  protected onMapPointsReturn(event: MapPoint[]) {
    this.mapPoints = event;
    // this.formPoints.value.mapPoints = event;
    this.formPoints.patchValue({ mapPoints: event });
    console.log('onMapPointsReturn', event);
  }
  onSize(event: number) {
    this.size = event;
    this.formPoints.patchValue({ size: event });
  }

  async onSubmit(_t217: MatStepper) {
    const payload = {
      ...this.formProperty.value,

      ...this.formAddress.value,
      ...this.formPoints.value,
    };

    console.log(payload);

    if (
      this.formProperty.valid &&
      this.formAddress.valid &&
      this.formPoints.valid
    ) {
      const payload = {
        ...this.formProperty.value,
        propertyActivities: this.formProperty.value.propertyActivities?.map(
          (v) => v.key
        ),
        ...this.formPoints.value,
        address: {
          ...this.formAddress.value,
        },
      } as IProperty;

      this.serviceProperty
        .registerNew(payload)
        .subscribe({
          next: (value) => {
            if (value.statusCode === HttpStatus.CREATED) {
              this.alert.success(
                `Fazenda: ${this.formProperty.value.name} registrado`
              );
              this.formProperty.reset();
              this.formPoints.reset();
              this.formAddress.reset();
              this.close.emit();
              return;
            }

            this.alert.warning(value.getMessage());
          }, error: (err) => {
            this.alert.warning(err.getMessage());
          }
        });
    }
  }
}
