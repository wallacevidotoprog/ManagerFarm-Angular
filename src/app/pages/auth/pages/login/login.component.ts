import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../../../../api/internal/service/user.api';
import { HttpStatus } from '../../../../../api/Utils/HttpStaus';
import { Role } from '../../../../Models/enum/auth.enum';
import { ILogin } from '../../../../Models/interfaces/api.interface';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  private service: UserApiService = inject(UserApiService);
  private alerts: ToastrService = inject(ToastrService);
  private router: Router = inject(Router);
  isLoadApi = false;
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const payload: ILogin = this.loginForm.value as ILogin;
      this.isLoadApi = true;
      this.service.login(payload).subscribe({
        next: (value) => {
          if (value.statusCode === HttpStatus.ACCEPTED) {
            this.alerts.info(
              `Olá ${value.getData()?.user_name}`,
              'Usuário logado'
            );
            localStorage.setItem('data-user', JSON.stringify(value.getData()));
            const role = value.getData()?.role;
            if (role === Role.OWNER || role === Role.GENERAL_MANAGER) {
              this.router.navigate(['/manager-farm']);
              return;
            }
            this.router.navigate(['/dashboard']);

            return;
          }
          this.alerts.warning(value.getMessage());
        },
        error: (err) => {
          this.alerts.error(err);
          console.error('Erro ao logar:', err);
        },
      });
      this.isLoadApi = false;
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
