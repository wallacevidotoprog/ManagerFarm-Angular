import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEmployee } from '../model/emploee.interface';
import { ResponseAPI } from '../model/response.api';

@Injectable({
  providedIn: 'root',
})
export class EmploeeApiService {
  private http = inject(HttpClient);

  registerEmployee(data: IEmployee): Observable<ResponseAPI<IEmployee>> {
    return this.http
      .post<ResponseAPI<IEmployee>>(`${environment.apiUrl}employee`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        observe: 'response',
        withCredentials:true
      })
      .pipe(
        map((res) => new ResponseAPI<IEmployee>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<IEmployee>(error, true);
          return of(responseApi);
        })
      );
  }
}
