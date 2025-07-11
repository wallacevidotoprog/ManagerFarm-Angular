import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-generic-table',
   imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,   
    MatPaginatorModule, 
  ],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  standalone: true,
})
export class GenericTableComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() columnLabels: Record<string, string> = {};
  @Input() totalItems = 0;
  @Input() pageSize = 5;
  @Input() pageIndex = 0;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() visualizar = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() excluir = new EventEmitter<any>();

  ngOnInit(): void {}
}
