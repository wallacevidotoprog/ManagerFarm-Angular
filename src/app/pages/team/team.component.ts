import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { IDepartament } from '../../../api/internal/model/departament.interface';
import { Employees } from '../../../api/internal/model/emploee.interface';
import { DepartamentApiService } from '../../../api/internal/service/departament.api';
import { HttpStatus } from '../../../api/Utils/HttpStaus';
import { RegisterComponent } from '../../components/team/register/register.component';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';

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
    MatPaginator,
    MatTooltipModule,
    GenericTableComponent,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  visualizarFuncionario($event: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private service = inject(DepartamentApiService);
  private alert = inject(ToastrService);
  protected fb: FormBuilder = inject(FormBuilder);

  protected departaments: IDepartament[] = [];
  protected funcionarios: Employees[] = [];
  protected dataSource: any[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  formAberto = false;
  fechar: any;
  protected filtroForm: FormGroup = this.fb.group({
    name: [''],
    cpf: [''],
  });

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

  protected async loadEmployee(page: number = 1, limit: number = 5) {
    let params = new HttpParams().set('page', page).set('limit', limit);

    const filtros = this.filtroForm.value;

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== null && valor !== undefined && valor !== '') {
        params = params.set(chave, String(valor));
      }
    });

    await this.service.getEmployee(params).subscribe({
      next: (value) => {
        console.log('value', value);

        if (value.statusCode === HttpStatus.OK) {
          this.dataSource = value.getData()?.data ?? []; // Array.isArray(value?.data) ? value.data : [];
          this.funcionarios = this.dataSource;
          this.totalItems = value.getData()?.total ?? 1;
          return;
        }
        this.alert.warning(value.getMessage());
      },
      error: (err) => {
        this.alert.warning(err.message);
      },
    });
  }

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

displayedColumns = ['name', 'cpf', 'email', 'phone', 'admission', 'actions'];
columnLabels = {
  name: 'Nome',
  cpf: 'CPF',
  email: 'Email',
  phone: 'Telefone',
  admission: 'Admissão',
  actions: 'Ações',
};

  editarFuncionario(func: any) {
    // lógica de edição
    console.log('Editar', func);
  }

  excluirFuncionario(func: any) {
    // lógica de exclusão
    console.log('Excluir', func);
  }

  aplicarFiltro() {
    this.loadEmployee(1); // volta para página 1 ao filtrar
    this.paginator.firstPage(); // reinicia o paginador
  }

  limparFiltro() {
    this.filtroForm.reset();
    this.aplicarFiltro();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployee(this.pageIndex + 1, this.pageSize);
  }
}
