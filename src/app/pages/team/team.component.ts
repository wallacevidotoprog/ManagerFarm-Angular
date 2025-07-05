import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { IDepartament } from '../../../api/internal/model/departament.interface';
import { DepartamentApiService } from '../../../api/internal/service/departament.api';
import { HttpStatus } from '../../../api/Utils/HttpStaus';
import { RegisterComponent } from '../../components/team/register/register.component';
import { Employees, ResponseEmployee } from '../../../api/internal/model/emploee.interface';

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
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  private dialog: MatDialog = inject(MatDialog);
  private service = inject(DepartamentApiService);
  private alert = inject(ToastrService);
  protected fb: FormBuilder = inject(FormBuilder);

  protected departaments: IDepartament[] = [];

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
        if (value.statusCode === HttpStatus.OK) {
          this.dataSource.data = value.data?.data ?? [] ;
          this.funcionarios = value.data?.data  ?? [] ;
          return;
        }
        this.alert.warning(value.getMessage());
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
  displayedColumns: string[] = [
    'name',
    'cpf',
    'email',
    'phone',
    'admission',
    'actions',
  ];

  funcionarios: Employees[] = [];

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

  aplicarFiltro() {
    this.loadEmployee(1); // volta para página 1 ao filtrar
    this.paginator.firstPage(); // reinicia o paginador
  }

  limparFiltro() {
    this.filtroForm.reset();
    this.aplicarFiltro();
  }

  onPageChange(event: any) {
    this.loadEmployee(event.pageIndex + 1, event.pageSize);
  }
}
