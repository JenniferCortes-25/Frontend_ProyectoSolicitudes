import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

/** Protege rutas que requieren sesión activa */
export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.estaAutenticado()) return true;

  router.navigate(['/login']);
  return false;
};