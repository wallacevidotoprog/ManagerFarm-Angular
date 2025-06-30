import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { MaskDirective } from '../../../directive/mask.directive';

@Component({
  selector: 'app-register-team',
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  protected isLoadApi = false;
  protected categorias = ['A', 'B', 'C', 'D', 'E'];
  protected sex = ['MASCULINO', 'FEMININO', 'OUTRO'];

  private fb: FormBuilder = inject(FormBuilder);

  protected formEmploee: FormGroup = this.fb.group({
    name: ['', Validators.required],
    cpf: ['', Validators.required],
    rg: [''],
    cnh: [''],
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

  onSubmit(stepper: MatStepper): void {
    if (this.formEmploee.valid && this.formAddres.valid && this.formAdm.valid) {
      this.isLoadApi = true;
      setTimeout(() => {
        this.isLoadApi = false;
      }, 2000);
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
