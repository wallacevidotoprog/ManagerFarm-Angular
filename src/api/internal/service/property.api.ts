import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProperty } from '../model/property.interface';
import { ResponseAPI } from '../model/response.api';
import { ResponseWhere } from '../model/ResponseWhere';

@Injectable({ providedIn: 'root' })
export class PropertyApiService {
  private http = inject(HttpClient);

  getAllProperty(): Observable<ResponseAPI<ResponseWhere<IProperty[]>>> {
    return this.http
      .get<ResponseAPI<ResponseWhere<IProperty[]>>>(`${environment.apiUrl}property`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((res) => new ResponseAPI<ResponseWhere<IProperty[]>>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<ResponseWhere<IProperty[]>>(error, true);
          return of(responseApi);
        })
      );
  }

  registerNew(data: IProperty): Observable<ResponseAPI<IProperty>> {
    return this.http
      .post<ResponseAPI<IProperty>>(`${environment.apiUrl}property`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((res) => new ResponseAPI<IProperty>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<IProperty>(error, true);
          return of(responseApi);
        })
      );
  }

  setProperty(idProp: string): Observable<ResponseAPI<any>> {
    const tempId = { id: idProp };
    return this.http
      .post<ResponseAPI<any>>(
        `${environment.apiUrl}auth/set-property`,
        tempId,
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
        map((res) => new ResponseAPI<any>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<any>(error, true);
          return of(responseApi);
        })
      );
  }
}
