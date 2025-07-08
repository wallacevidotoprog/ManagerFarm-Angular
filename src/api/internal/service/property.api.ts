import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IDepartament } from '../model/departament.interface';
import { ResponseEmployee } from '../model/emploee.interface';
import { IProperty } from '../model/property.interface';
import { ResponseAPI } from '../model/response.api';

@Injectable({ providedIn: 'root' })
export class PropertyApiService {
  private http = inject(HttpClient);

  getAllProperty(): Observable<ResponseAPI<IProperty[]>> {
    return this.http
      .get<ResponseAPI<IProperty[]>>(
        `${environment.apiUrl}property`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          observe: 'response',
        }
      )
      .pipe(
        map((res) => new ResponseAPI<IProperty[]>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<IProperty[]>(error, true);
          return of(responseApi);
        })
      );
  }

  registerNew(data: IProperty): Observable<ResponseAPI<IProperty>> {
    return this.http
      .post<ResponseAPI<IProperty>>(
        `${environment.apiUrl}property`,
        data,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          observe: 'response',
          withCredentials: true,
        }
      )
      .pipe(
        map((res) => new ResponseAPI<IProperty>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<IProperty>(error, true);
          return of(responseApi);
        })
      );
  }
}
