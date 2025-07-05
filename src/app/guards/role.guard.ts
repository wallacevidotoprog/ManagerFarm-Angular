import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { UserApiService } from '../../api/internal/service/user.api';
import { HttpStatus } from '../../api/Utils/HttpStaus';
import { Role } from '../Models/enum/auth.enum';
import { Observable } from 'rxjs';

export const RoleGuard = (requiredRoles: Role[]): CanActivateFn => {
  return (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const authService = inject(UserApiService);
    const router = inject(Router);

    const user = authService.getCurrentUser();
    
    return user.toPromise().then((value) => {
      if (value?.statusCode === HttpStatus.OK) {
        
        const hasRequiredRole = requiredRoles.some(role => 
          value?.data?.includes(role)
        );
        
        if (hasRequiredRole) {
          return true; // Permite o acesso
        }
      }
      
      return router.createUrlTree(['/unauthorized']);
    }).catch((err) => {
      console.error('Erro ao verificar permissões:', err);
      return router.createUrlTree(['/unauthorized']);
    });
  };
};
