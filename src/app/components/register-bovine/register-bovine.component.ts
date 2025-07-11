import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  BaseModalComponent,
  ModalBase,
} from '../base-modal/base-modal.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-register-bovine',
  imports: [
    BaseModalComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTab,
    MatTabGroup
  ],
  templateUrl: './register-bovine.component.html',
  styleUrl: './register-bovine.component.scss',
})
export class RegisterBovineComponent extends ModalBase {
  protected fb :FormBuilder = inject(FormBuilder);
  sexes = ['M', 'F'];
  // areas$ = this.bovineService.getAreas();
  // breeds$ = this.bovineService.getBreeds();
  // bovines$ = this.bovineService.getAll();

  protected bovineForm = this.fb.group({
    name: ['', Validators.required],
    birthDate: ['', Validators.required],
    sex: ['', Validators.required],
    situation: ['', Validators.required],
    modality: ['', Validators.required],
    phaseCut: ['', Validators.required],
    phaseMilk: ['', Validators.required],
    fatherId: [''],
    motherId: [''],
    arealId: [''],
    breedId: [''],
  });

  onSubmit(): void {
    if (this.bovineForm.valid) {
      // this.bovineService.create(this.bovineForm.value).subscribe(() => {
      //   alert('Bovino cadastrado com sucesso!');
      //   this.bovineForm.reset();
      // });
    }
  }
}
