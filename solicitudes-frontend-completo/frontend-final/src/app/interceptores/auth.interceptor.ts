import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../servicios/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Usamos AuthService en lugar de leer localStorage directamente
  const token = inject(AuthService).getToken();

  if (token) {
    const peticionAutenticada = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(peticionAutenticada);
  }

  return next(req); // Sin token: la petición sale sin modificar (ej: login)
};