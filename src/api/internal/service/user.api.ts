import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
  ICheckedAccount,
  ILogin,
  IUser,
} from '../../../app/Models/interfaces/api.interface';
import { environment } from '../../../environments/environment';
import { ResponseAPI } from '../model/response.api';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);

  registerUserDefault(data: IUser): Observable<ResponseAPI<any>> {
    return this.http
      .post<ResponseAPI<any>>(`${environment.apiUrl}auth/register`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        observe: 'response',
      })
      .pipe(
        map((res) => new ResponseAPI<any>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<any>(error, true);
          return of(responseApi);
        })
      );
  }

  checkedKey(data: ICheckedAccount): Observable<ResponseAPI<any>> {
    return this.http
      .post<ResponseAPI<any>>(
        `${environment.apiUrl}auth/active-account`,
        data,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          observe: 'response',
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

  login(data: ILogin): Observable<ResponseAPI<any>> {
    return this.http
      .post<ResponseAPI<any>>(`${environment.apiUrl}auth/login`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((res) => new ResponseAPI<any>(res)),
        catchError((error: HttpErrorResponse) => {
          const responseApi = new ResponseAPI<any>(error, true);
          return of(responseApi);
        })
      );
  }

  logout(): Observable<ResponseAPI<any>> {
    return this.http
      .post<ResponseAPI<any>>(
        `${environment.apiUrl}auth/active-account`,
        null,
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

  checked(): Observable<ResponseAPI<any>> {
    return this.http
      .get<ResponseAPI<any>>(
        `${environment.apiUrl}auth/check`,

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

  // getCurrentUser(): { name: string; role: string } | null {
  //   const data = localStorage.getItem('user');
  //   return data ? JSON.parse(data) : null;
  // } VERIFICAR ISSO
  getCurrentUser() {
    return this.http
      .get<ResponseAPI<any>>(
        `${environment.apiUrl}auth/role`,

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

  teste() {
    const resp = this.http
      .post<ResponseAPI<any>>(`${environment.apiUrl}auth/logout`, null, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        observe: 'response',
      })
      .pipe(
        map((res) => {
          console.log('VEIO = > ', res);
          console.log('ResponseAPI = > ', new ResponseAPI<any>(res));
        })
      );

    console.log(
      'observe:  response:',
      resp.subscribe((data) => {
        return data;
      })
    );
    // const body = this.http.post(`${environment.apiUrl}auth/logout`, {
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   observe: 'body',
    // });
    // console.log(
    //   'observe:  body:',
    //   body.subscribe((data) => {
    //     return new RespondeAPI(data);
    //   })
    // );
  }
}
