import { CommonModule } from '@angular/common';
import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-base-modal',
  standalone:true,
  imports: [MatIcon,CommonModule],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.scss',
  
})
export class BaseModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Título do Modal';
  @Input() icon = 'info';

  @Output() closeModal = new EventEmitter<void>();

  
}


@Directive()
export abstract class ModalBase {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}



