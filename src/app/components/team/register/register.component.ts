import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
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
import { IEmployee } from '../../../../api/internal/model/emploee.interface';
import { EmploeeApiService } from '../../../../api/internal/service/emploee.api';
import { HttpStatus } from '../../../../api/Utils/HttpStaus';
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
  private alert: ToastrService = inject(ToastrService);

  protected isLoadApi = false;
  protected cnhCategory = ['A', 'B', 'C', 'D', 'E'];
  protected sex = ['MASCULINO', 'FEMININO', 'OUTRO'];
  protected selectedDepartamento!: IDepartament;
  protected availableFunctions: IFunctionsList[] = [];
  protected separatorKeysCodes: number[] = [ENTER, COMMA];
  protected categoriaInputControl = this.fb.control('');
  protected filteredCategorias: string[] = [...this.cnhCategory];

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
  protected formAddres = this.fb.group({
    cep: ['', Validators.required],
    place: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    uf: ['', [Validators.required, Validators.maxLength(2)]],
  });

  selectedCategoria(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value;
    const current = this.formEmploee.get('category_cnh')?.value;
    if (!current.includes(selected)) {
      this.formEmploee.get('category_cnh')?.setValue([...current, selected]);
    }
    this.categoriaInputControl.setValue('');
  }
  addCategoriaViaEnter() {
    const value = this.categoriaInputControl.value?.trim();
    if (
      value &&
      this.cnhCategory.includes(value) &&
      !this.formEmploee.get('category_cnh')?.value.includes(value)
    ) {
      const current = this.formEmploee.get('category_cnh')?.value;
      this.formEmploee.get('category_cnh')?.setValue([...current, value]);
      this.categoriaInputControl.setValue('');
    }
  }
  addCategoria(event: any): void {
    const inputValue = event.value?.trim();
    if (inputValue && this.cnhCategory.includes(inputValue)) {
      const current = this.formEmploee.get('category_cnh')?.value;
      if (!current.includes(inputValue)) {
        this.formEmploee
          .get('category_cnh')
          ?.setValue([...current, inputValue]);
        this.categoriaInputControl.setValue('');
      }
    }
  }
  removeCategoria(categoria: string): void {
    const current = this.formEmploee.get('category_cnh')?.value;
    this.formEmploee
      .get('category_cnh')
      ?.setValue(current.filter((c: string) => c !== categoria));
  }

  async onSubmit(stepper: MatStepper): Promise<void> {
    if (this.formEmploee.valid && this.formAddres.valid && this.formAdm.valid) {
      const payload: IEmployee = {
        ...this.formEmploee.value,
        ...this.formAdm.value,
        address: {
          ...this.formAddres.value,
        },
      };

      await this.service.registerEnployee(payload).subscribe({
        next: (value) => {
          if (value.statusCode === HttpStatus.CREATED) {
            this.alert.success(
              `Funcionário: ${this.formEmploee.value.name} registrado`
            );
            return;
          }

          this.alert.warning(value.getMessage());
        },
        error: (err) => {
          this.alert.warning(err.message);
        },
      });

      // console.log(payload);

      this.isLoadApi = true;
      // setTimeout(() => {
      //   this.isLoadApi = false;
      // }, 2000);
    }
    // if (this.form.invalid) return;
    // const payload = this.form.value;
    // console.log('Enviar para API:', payload);
    // this.funcionarioService.create(payload).subscribe(...)
  }
  close() {
    this.closeModal.emit();
  }
}
