import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
  IDepartament,
  IFunctionsList,
} from '../../../../api/internal/model/departament.interface';
import { MaskDirective } from '../../../directive/mask.directive';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { CepService } from '../../../../api/external/services/cep.service';
import { IEmployee } from '../../../../api/internal/model/emploee.interface';
import { EmploeeApiService } from '../../../../api/internal/service/emploee.api';
import { HttpStatus } from '../../../../api/Utils/HttpStaus';
import { cnhCategory, sex, ufs } from '../../../common/arrays-default';
import { InputChipsComponent } from '../../input-chips/input-chips.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FarmActivityType } from '../../../Models/enum/property.enum';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-register-team',
  standalone: true,
  imports: [
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
    InputChipsComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @Input() isOpen = false;
  @Input() dataDepartament: IDepartament[] = [];
  @Output() closeModal = new EventEmitter<void>();

  private fb: FormBuilder = inject(FormBuilder);
  private service: EmploeeApiService = inject(EmploeeApiService);
  private cepService: CepService = inject(CepService);
  private alert: ToastrService = inject(ToastrService);

  
  
  protected isLoadApi = false;
  protected cnhCategory = cnhCategory;
  protected sex = sex;
  protected uf = ufs;
  protected selectedDepartamento!: IDepartament;
  protected availableFunctions: IFunctionsList[] = [];

  protected formEmploee: FormGroup = this.fb.group({
    name: ['', Validators.required],
    cpf: ['', Validators.required],
    rg: [''],
    cnh: [[]],
    category_cnh: [''],
    maturity_cnh: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    birth: ['', Validators.required],
    sex: [''],
  });
  protected formAdm = this.fb.group({
    admission: ['', Validators.required],
    salary: [null, [Validators.required, Validators.min(0)]],
    cbo: [''],
    pis: [''],
    functionId: ['', Validators.required],
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
teste(){
  console.log('this.formAdm: ',this.formAdm.value);
  console.log('this.formAdm -  Format : ', parseFloat(this.formAdm.value.salary ?? '0') / 100);
  
}
  async onSubmit(stepper: MatStepper): Promise<void> {
    if (
      this.formEmploee.valid &&
      this.formAddress.valid &&
      this.formAdm.valid
    ) {
      const payload: IEmployee = {
        ...this.formEmploee.value,
        ...this.formAdm.value,
        salary: (parseFloat(this.formAdm.value.salary ?? '0') / 100),
        address: {
          ...this.formAddress.value,
        },
      };
      this.isLoadApi = true;
      await this.service.registerEmployee(payload).subscribe({
        next: (value) => {
          if (value.statusCode === HttpStatus.CREATED) {
            this.alert.success(
              `Funcionário: ${this.formEmploee.value.name} registrado`
            );
            this.formEmploee.reset()
            this.formAdm.reset()
            this.formAddress.reset()
            this.closeModal.emit();
            return;
          }

          this.alert.warning(value.getMessage());
        },
        error: (err) => {
          this.alert.warning(err.message);
        },
      });
      this.isLoadApi = false;
    }
  }
  close() {
    this.closeModal.emit();
  }

  searchCEP() {
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

  
}
