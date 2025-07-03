import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IDepartament } from '../model/departament.interface';
import { ResponseAPI } from '../model/response.api';

@Injectable({ providedIn: 'root' })
export class DepartamentApiService {
  private http = inject(HttpClient);

  getAllDepartamentAndFunctions(): Observable<ResponseAPI<IDepartament[]>> {
    return this.http
      .get<ResponseAPI<IDepartament[]>>(
        `${environment.apiUrl}department/dp-desc-all`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          observe: 'response',
        }
      )
      .pipe(
        map((res) => new ResponseAPI<IDepartament[]>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<IDepartament[]>(error, true);
          return of(responseApi);
        })
      );
  }
}
