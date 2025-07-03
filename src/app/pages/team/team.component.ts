import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToastrService } from 'ngx-toastr';
import { IDepartament } from '../../../api/internal/model/departament.interface';
import { DepartamentApiService } from '../../../api/internal/service/departament.api';
import { RegisterComponent } from '../../components/team/register/register.component';

@Component({
  selector: 'app-team',
  imports: [
    MatTabsModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    RegisterComponent,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  private dialog: MatDialog = inject(MatDialog);
  private service = inject(DepartamentApiService);
  private alert = inject(ToastrService);
  protected departaments: IDepartament[] = [];

  async ngOnInit(): Promise<void> {
    await this.service.getAllDepartamentAndFunctions().subscribe({
      next: (value) => {
        this.departaments = value.data as IDepartament[];
      },
      error: (err) => {
        this.alert.warning(err.message);
      },
    });
  }

  funcionarios = [
    { name: 'João Silva', cpf: '123.456.789-00' },
    { name: 'Maria Oliveira', cpf: '987.654.321-00' },
  ];

  displayedColumns: string[] = ['name', 'cpf', 'actions'];
  formAberto = false;
  fechar: any;

  abrirFormulario() {
    this.formAberto = true;
  }

  fecharFormulario() {
    this.formAberto = false;
  }

  editarFuncionario(funcionario: any) {
    this.abrirFormulario();
    // preenche o form se quiser
  }

  excluirFuncionario(funcionario: any) {
    // lógica de exclusão
    alert(`Excluir ${funcionario.name}`);
  }

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    console.log('team close modal');

    this.showModal = false;
  }
}
