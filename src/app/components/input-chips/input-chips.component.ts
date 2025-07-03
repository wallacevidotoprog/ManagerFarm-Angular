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
  @Input() options: string[] = [];

  inputControl = new FormControl('');
  filteredOptions: string[] = [];

  value: string[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(
        startWith(''),
        map((val) => this._filter(val??''))
      )
      .subscribe((filtered) => (this.filteredOptions = filtered));
  }

  writeValue(value: string[]): void {
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
    const value = event.value?.trim();

    if (value && !this.value.includes(value)) {
      this.value.push(value);
      this.onChange(this.value);
    }

    if (input) {
      input.value = '';
    }

    this.inputControl.setValue('');
  }

  remove(item: string): void {
    const index = this.value.indexOf(item);
    if (index >= 0) {
      this.value.splice(index, 1);
      this.onChange(this.value);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value;

    if (!this.value.includes(selectedValue)) {
      this.value.push(selectedValue);
      this.onChange(this.value);
    }

    this.inputControl.setValue('');
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(
      (opt) =>
        opt.toLowerCase().includes(filterValue) && !this.value.includes(opt)
    );
  }
}
