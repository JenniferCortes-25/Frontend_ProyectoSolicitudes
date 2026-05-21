import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

/**
 * rolesGuard — Protege rutas que requieren un rol específico.
 *
 * Flujo de verificación (en orden):
 *   1. ¿Está autenticado?  NO  → redirige a /login
 *   2. ¿Tiene el rol?      NO  → redirige a /unauthorized
 *   3. Todo OK             →   permite el acceso (retorna true)
 *
 * USO EN RUTAS:
 *   {
 *     path: 'usuarios',
 *     canActivate: [authGuard, rolesGuard],
 *     data: { roles: ['ADMIN'] },
 *     component: ListaUsuarios
 *   }
 *
 * ¿Por qué también verificar autenticación aquí si ya se usa authGuard?
 * rolesGuard puede usarse SIN authGuard en algunas rutas. Verificar ambas
 * condiciones lo hace autocontenido y seguro en cualquier combinación.
 *
 * route.data['roles'] es metadata estática definida en la ruta — el mismo guard
 * funciona para cualquier ruta, solo cambia el valor de data.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Paso 1: verificar autenticación
  if (!auth.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  // Paso 2: leer roles requeridos desde route.data
  // Soporta la clave 'roles' (usada en tu proyecto actual)
  const rolesRequeridos: string[] = route.data['roles'] ?? [];

  // Si la ruta no especifica roles, solo se exige autenticación
  if (rolesRequeridos.length === 0) return true;

  // Paso 3: verificar si el usuario tiene al menos uno de los roles requeridos
  const tieneRol = rolesRequeridos.some(rol => auth.hasRole(rol));

  return tieneRol
    ? true
    : router.createUrlTree(['/unauthorized']);
};