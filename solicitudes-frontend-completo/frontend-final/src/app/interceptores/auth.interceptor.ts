import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

/**
 * authInterceptor — Interceptor JWT funcional.
 *
 * Para cada petición HTTP saliente:
 *   1. Si NO hay sesión activa → pasa la petición sin modificar (ej: POST /auth/login).
 *   2. Si HAY sesión → clona la petición añadiendo Authorization: Bearer <token>.
 *   3. Si el backend responde 401 → hace logout automático + redirige a /login.
 *
 * ¿Por qué req.clone() y no modificar req directamente?
 * Las peticiones HTTP en Angular son INMUTABLES. clone() crea una copia con los
 * cambios aplicados, dejando la petición original intacta (necesario para el pipeline).
 *
 * ¿Por qué verificar isAuthenticated() en lugar de solo getToken()?
 * Sincroniza con el signal reactivo del AuthService. Si el signal dice "no autenticado",
 * no adjuntamos token aunque exista algún residuo en localStorage.
 *
 * REGISTRO en app.config.ts:
 *   provideHttpClient(withInterceptors([authInterceptor]))
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  // Peticiones sin sesión activa no llevan token (ej: login, registro)
  if (!authService.estaAutenticado()) {
    return next(req);
  }

  const token = authService.getToken();

  // Clonar la petición añadiendo el header de autorización
  const peticionAutenticada = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(peticionAutenticada).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized: token expirado o inválido
      if (error.status === 401) {
        // Limpiar sesión y redirigir al login de forma controlada
        authService.logout();
        router.navigate(['/login']);
      }
      // Propagar el error para que los componentes puedan manejarlo si lo necesitan
      return throwError(() => error);
    })
  );
};