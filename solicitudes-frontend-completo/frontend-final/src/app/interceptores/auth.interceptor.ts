import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicios/auth.service';
import { NotificationService } from '../servicios/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService         = inject(AuthService);
  const router              = inject(Router);
  const notificationService = inject(NotificationService);

  if (!authService.estaAutenticado()) {
    return next(req);
  }

  const token = authService.getToken();

  const peticionAutenticada = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(peticionAutenticada).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        notificationService.warn('Sesión expirada', 'Por favor inicie sesión nuevamente.');
      } else if (error.status === 403) {
        notificationService.error('Acceso denegado', 'No tiene permisos para esta acción.');
      } else if (error.status === 0) {
        notificationService.error('Sin conexión', 'No se pudo conectar con el servidor.');
      }
      return throwError(() => error);
    })
  );
};