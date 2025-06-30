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
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CepService } from '../../../../../api/external/services/cep.service';
import { UserApiService } from '../../../../../api/internal/service/user.api';
import { HttpStatus } from '../../../../../api/Utils/HttpStaus';
import { cpfValidator } from '../../../../common/validators/cpf.validator';
import { MaskDirective } from '../../../../directive/mask.directive';
import { ICheckedAccount } from '../../../../Models/interfaces/api.interface';
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
    MaskDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  userForm: FormGroup;
  addressForm: FormGroup;
  keyForm: FormGroup;
  hidePassword = true;
  private cepService: CepService = inject(CepService);
  private serviceUser: UserApiService = inject(UserApiService);
  private route: Router = inject(Router);
  private alerts: ToastrService = inject(ToastrService);

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

    this.keyForm = this.fb.group({
      key: ['', Validators.required],
    });

    this.addressForm.get('cep')?.valueChanges.subscribe((cep) => {
      if (cep?.length === 8) {
        this.buscarCep(cep);
      }
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

  onSubmit(stepper: MatStepper) {
    if (this.userForm.valid && this.addressForm.valid) {
      const fullData = {
        ...this.userForm.value,
        address: this.addressForm.value,
      };
      this.serviceUser.registerUserDefault(fullData).subscribe({
        next: (value) => {
          console.log('value:', value);

          if (value.statusCode === HttpStatus.OK) {
            this.alerts.info('Código enviado por email', 'Acesse seu Email');
            stepper.next();
            return;
          }
          this.alerts.error(value.getMessage(), 'Erro ao criar usuário.');
        },
        error: (err) => {
          console.error('Erro ao registrar:', err);
          this.alerts.error(err.message || 'Erro desconhecido.');
        },
      });
    }
  }

  onSubmitKey() {
    if (this.keyForm.valid) {
      const payload: ICheckedAccount = {
        email: this.userForm.value.email,
        key: this.keyForm.value.key,
      };
      this.serviceUser.checkedKey(payload).subscribe({
        next: (value) => {
          if (value.statusCode === HttpStatus.OK) {
            this.alerts.success('Conta criada com sucesso', 'Sucesso');
            this.route.navigate(['/auth/login']);
          }
          this.alerts.error(
            value.getMessage(),
            'Erro ao aconfirmar a chave de acesso.'
          );
        },
        error: (err) => {
          this.alerts.error(err.message || 'Erro desconhecido.');
          console.error('Erro:', err);
        },
      });
    }
  }
}
