import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

/**
 * publicGuard — Evita que usuarios autenticados accedan a rutas públicas (ej: /login).
 *
 * ✅ Si NO está autenticado → permite el acceso (retorna true).
 * 🚫 Si YA está autenticado → redirige a /solicitudes (retorna UrlTree).
 *
 * Sin este guard, un usuario con sesión activa podría navegar manualmente a /login
 * y obtener un estado inconsistente (logueado pero viendo el formulario de login).
 */
export const publicGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  return auth.estaAutenticado()
    ? router.createUrlTree(['/solicitudes'])
    : true;
};