import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, Subject, switchMap } from 'rxjs';
import { PropertyApiService } from '../../../api/internal/service/property.api';
import { HttpStatus } from '../../../api/Utils/HttpStaus';
import { RegisterFarmComponent } from '../../components/register-farm/register-farm.component';

@Component({
  selector: 'app-manager-farm',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    RegisterFarmComponent,
    MatChip,
    RouterModule,
    MatIcon,
  ],
  templateUrl: './manager-farm.component.html',
  styleUrl: './manager-farm.component.scss',
})
export class ManagerFarmComponent {
  private serviceProperty: PropertyApiService = inject(PropertyApiService);
  private alerts: ToastrService = inject(ToastrService);
  private router: Router = inject(Router);
  private refresh$ = new Subject<void>();

  properties$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.serviceProperty.getAllProperty().pipe(map((resp) => resp.data))
    )
  );
  openModalRegisterFarm: boolean = false;

  enterProperty(id?: string) {
    if (id) {
      this.serviceProperty.setProperty(id).subscribe({
        next: (value) => {
          if (value.statusCode === HttpStatus.ACCEPTED) {
            // localStorage.setItem('data-user', JSON.stringify(value.getData()));
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
    }
  }
  fecharModal() {
    this.openModalRegisterFarm = false;
    this.refresh$.next();
  }
  cadastrarNovaFazenda() {
    this.openModalRegisterFarm = true;
  }
  editProperty(arg0: string | undefined) {
    throw new Error('Method not implemented.');
  }
}
