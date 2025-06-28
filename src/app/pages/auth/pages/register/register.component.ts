import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CepService } from '../../../../../api/external/services/cep.service';
import { cpfValidator } from '../../../../common/validators/cpf.validator';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatStepperModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  userForm: FormGroup;
  addressForm: FormGroup;
  hidePassword = true;
  private cepService: CepService = inject(CepService);
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', [Validators.required, cpfValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: [''],
    });

    this.addressForm = this.fb.group({
      cep: ['', Validators.required],
      place: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      uf: ['', [Validators.required, Validators.maxLength(2)]],
    });

    this.addressForm.get('cep')?.valueChanges.subscribe((cep) => {
      if (cep?.length === 9) this.buscarCep(cep);
    });
  }

  buscarCep(cep: string) {
    this.cepService.searchCep(cep.replace(/\D/g, '')).subscribe((data) => {
      if (!data.erro) {
        this.addressForm.patchValue({
          place: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          uf: data.uf,
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid && this.addressForm.valid) {
      const fullData = {
        ...this.userForm.value,
        role: 'USER',
        active: true,
        address: this.addressForm.value,
      };
      console.log('Cadastro final:', fullData);
    }
  }
}
