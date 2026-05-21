import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';


export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Lee el WritableSignal — reactivo, sincronizado con login/logout
  return auth.estaAutenticado()
    ? true
    : router.createUrlTree(['/login']);
};