import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { RegisterFarmComponent } from '../../components/register-farm/register-farm.component';

@Component({
  selector: 'app-manager-farm',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    RegisterFarmComponent,
  ],
  templateUrl: './manager-farm.component.html',
  styleUrl: './manager-farm.component.scss',
})
export class ManagerFarmComponent {

  fazendas = [
    {
      id: 1,
      nome: 'Fazenda Boa Vista',
      area: 120,
      proprietario: 'João Silva',
      localizacao: {
        cidade: 'Uberlândia',
        estado: 'MG',
      },
    },
    {
      id: 2,
      nome: 'Fazenda Santa Luzia',
      area: 200,
      proprietario: 'Maria Souza',
      localizacao: {
        cidade: 'Ribeirão Preto',
        estado: 'SP',
      },
    },
  ];
  openModalRegisterFarm: boolean = false;

  entrarFazenda(fazenda: any) {
    console.log('Entrando na fazenda:', fazenda);
    // Ex: navegar para dashboard da fazenda
  }
fecharModal() {
this.openModalRegisterFarm = false  ;
}
  cadastrarNovaFazenda() {
    this.openModalRegisterFarm = true;
    console.log('Navegar para página de cadastro de fazenda');
    // Ex: this.router.navigate(['/fazenda/nova']);
  }
}
