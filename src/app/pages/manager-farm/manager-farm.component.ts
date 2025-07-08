import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastrService } from 'ngx-toastr';
import { IProperty } from '../../../api/internal/model/property.interface';
import { PropertyApiService } from '../../../api/internal/service/property.api';
import { HttpStatus } from '../../../api/Utils/HttpStaus';
import { RegisterFarmComponent } from '../../components/register-farm/register-farm.component';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-manager-farm',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    RegisterFarmComponent,
    MatChip
  ],
  templateUrl: './manager-farm.component.html',
  styleUrl: './manager-farm.component.scss',
})
export class ManagerFarmComponent implements OnInit {
  private serviceProperty: PropertyApiService = inject(PropertyApiService);
  private alert: ToastrService = inject(ToastrService);

  protected properties: IProperty[] = [];

  ngOnInit(): void {
    this.serviceProperty.getAllProperty().subscribe({
      next: (value) => {
        if (value.statusCode === HttpStatus.OK) {

          console.log('value.getData()',value.getData());
          
          this.properties = value.getData()??[]
          return;
        }
        this.alert.warning(value.getMessage());
      },
      error: (err) => {
        this.alert.warning(err.getMessage());
      },
    });
  }

  openModalRegisterFarm: boolean = false;

  entrarFazenda(fazenda: any) {
    console.log('Entrando na fazenda:', fazenda);
    // Ex: navegar para dashboard da fazenda
  }
  fecharModal() {
    this.openModalRegisterFarm = false;
  }
  cadastrarNovaFazenda() {
    this.openModalRegisterFarm = true;
    console.log('Navegar para página de cadastro de fazenda');
    // Ex: this.router.navigate(['/fazenda/nova']);
  }
}
