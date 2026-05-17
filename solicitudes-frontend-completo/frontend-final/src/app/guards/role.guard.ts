import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

/** Protege rutas que requieren un rol específico */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Los roles permitidos se definen en data: { roles: ['ADMIN'] }
  const rolesPermitidos: string[] = route.data['roles'] ?? [];
  const tieneRol = rolesPermitidos.some(r => auth.hasRole(r));

  if (tieneRol) return true;

  router.navigate(['/']);
  return false;
};