import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, startWith } from 'rxjs';
import { ListKeyView } from '../../@types/default.types';

@Component({
  selector: 'app-input-chips',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputChipsComponent),
      multi: true,
    },
  ],
  templateUrl: './input-chips.component.html',
  styleUrl: './input-chips.component.scss',
})
export class InputChipsComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = 'Selecionar';
  @Input() placeholder: string = 'Digite um valor...';
  @Input() options: ListKeyView[] = [];

  inputControl = new FormControl('');
  filteredOptions: ListKeyView[] = [];

  value: ListKeyView[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(
        startWith(''),
        map((val) => this._filter(val ?? ''))
      )
      .subscribe((filtered) => (this.filteredOptions = filtered));
  }

  writeValue(value: ListKeyView[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  add(event: any): void {
    const input = event.input;
    const inputValue: string = event.value?.trim();

    if (inputValue) {
      // Tentamos achar um objeto com view igual ao texto digitado (ignorar case)
      const existingOption = this.options.find(
        (opt) => opt.view.toLowerCase() === inputValue.toLowerCase()
      );

      // Se achar e não estiver no valor atual, adiciona o objeto; senão, pode criar um objeto novo com key = view (opcional)
      if (existingOption && !this.value.find(v => v.key === existingOption.key)) {
        this.value.push(existingOption);
        this.onChange(this.value);
      }
    }

    if (input) {
      input.value = '';
    }
    this.inputControl.setValue('');
  }

  remove(item: ListKeyView): void {
    const index = this.value.findIndex(v => v.key === item.key);
    if (index >= 0) {
      this.value.splice(index, 1);
      this.onChange(this.value);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedKeyView: ListKeyView = event.option.value;

    if (!this.value.find(v => v.key === selectedKeyView.key)) {
      this.value.push(selectedKeyView);
      this.onChange(this.value);
    }
    this.inputControl.setValue('');
  }

  private _filter(value: string): ListKeyView[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(
      (opt) =>
        opt.view.toLowerCase().includes(filterValue) &&
        !this.value.find(v => v.key === opt.key)
    );
  }
}
