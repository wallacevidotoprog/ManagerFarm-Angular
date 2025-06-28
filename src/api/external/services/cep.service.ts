import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CepModal } from '../model/result-cep.interface';

@Injectable({ providedIn: 'root' })
export class CepService {
  private http = inject(HttpClient);

  searchCep(cep: string): Observable<CepModal> {
    return this.http.get<CepModal>(`https://viacep.com.br/ws/${cep}/json/`);
  }
}
