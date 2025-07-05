import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { CepService } from '../../../api/external/services/cep.service';
import { ufs } from '../../common/arrays-default';

@Component({
  selector: 'app-address',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatFormField,
    MatLabel,
    MatOption,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit {
  protected uf = ufs;
  @Output() data = new EventEmitter<FormGroup>();

  private fb: FormBuilder = inject(FormBuilder);
  private cepService: CepService = inject(CepService);

  protected formAddress = this.fb.group({
    cep: ['', Validators.required],
    place: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    uf: ['', [Validators.required, Validators.maxLength(2)]],
  });
  ngOnInit(): void {
    this.data.emit(this.formAddress);
  }
  protected getForm() {
    this.data.emit(this.formAddress);
  }

  searchCEP() {
    const cep = this.formAddress.get('cep')?.value;
    console.log('cep', cep);

    if (cep?.length === 8) {
      this.cepService.searchCep(cep.replace(/\D/g, '')).subscribe((data) => {
        if (!data.erro) {
          this.formAddress.patchValue({
            place: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            uf: data.uf,
          });
        }
      });
    }
  }
}
