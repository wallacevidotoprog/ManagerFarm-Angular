import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../api/internal/service/user.api';
import { HttpStatus } from '../../api/Utils/HttpStaus';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private alerts = inject(ToastrService);

  constructor(private authService: UserApiService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checked().pipe(
      map((value) => {
        if (value.statusCode === HttpStatus.OK) {
          return true;
        }
        this.alerts.error(value.getMessage());
        return this.router.createUrlTree(['/auth/login']);
      }),
      catchError((err) => {
        this.alerts.error('Erro ao verificar autenticação.');
        console.error('Erro ao logar:', err);
        return of(this.router.createUrlTree(['/auth/login']));
      })
    );
  }
}