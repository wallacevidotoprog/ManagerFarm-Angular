import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToastrService } from 'ngx-toastr';
import { IDepartament } from '../../../api/internal/model/departament.interface';
import { DepartamentApiService } from '../../../api/internal/service/departament.api';
import { RegisterComponent } from '../../components/team/register/register.component';
import { MatPaginator } from '@angular/material/paginator';

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
    MatPaginator
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

  

  formAberto = false;
  fechar: any;

  abrirFormulario() {
    this.formAberto = true;
  }

  fecharFormulario() {
    this.formAberto = false;
  }


  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    console.log('team close modal');

    this.showModal = false;
  }


 isMobile = false;
  displayedColumns: string[] = ['name', 'cpf', 'rg', 'email', 'phone', 'admission', 'actions'];


  funcionarios = [
    {
      name: "João da Silva",
      cpf: "12345678900",
      email: "wallacevidoto@email.com",
      phone: "11912345678",
      admission: "2023-01-10T00:00:00.000Z",
      
    }
    // ...adicione mais funcionários
  ];

  dataSource = new MatTableDataSource<any>(this.funcionarios);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editarFuncionario(func: any) {
    // lógica de edição
    console.log('Editar', func);
  }

  excluirFuncionario(func: any) {
    // lógica de exclusão
    console.log('Excluir', func);
  }
}
