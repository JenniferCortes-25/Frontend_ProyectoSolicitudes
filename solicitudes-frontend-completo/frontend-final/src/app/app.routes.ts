import { Routes } from '@angular/router';
import { authGuard }   from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { roleGuard }   from './guards/role.guard';

export const routes: Routes = [
  // Ruta raíz (pública)
  {
    path: '',
    loadComponent: () => import('./componentes/inicio/inicio').then(m => m.Inicio)
  },

  // Ruta pública — publicGuard evita que usuarios autenticados regresen al login
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./componentes/login/login').then(m => m.Login)
  },

  // Rutas protegidas — requieren sesión activa (authGuard)
  {
    path: 'solicitudes',
    canActivate: [authGuard],
    loadComponent: () => import('./componentes/solicitudes/lista-solicitudes/lista-solicitudes').then(m => m.ListaSolicitudes)
  },
  {
    path: 'solicitudes/nueva',
    canActivate: [authGuard],
    loadComponent: () => import('./componentes/solicitudes/nueva-solicitud/nueva-solicitud').then(m => m.NuevaSolicitud)
  },
  {
    path: 'solicitudes/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./componentes/solicitudes/detalle-solicitud/detalle-solicitud').then(m => m.DetalleSolicitud)
  },
  {
    path: 'cambiar-password',
    canActivate: [authGuard],
    loadComponent: () => import('./componentes/cambiar-password/cambiar-password').then(m => m.CambiarPassword)
  },

  // Ruta protegida por ROL — requiere sesión + rol ADMIN
  {
    path: 'usuarios',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./componentes/usuarios/lista-usuarios/lista-usuarios').then(m => m.ListaUsuarios)
  },

  // Página de acceso denegado (pública)
  {
    path: 'unauthorized',
    loadComponent: () => import('./componentes/unauthorized/unauthorized').then(m => m.Unauthorized)
  },

  // Wildcard — cualquier ruta desconocida redirige al inicio
  { path: '**', pathMatch: 'full', redirectTo: '/' }
];