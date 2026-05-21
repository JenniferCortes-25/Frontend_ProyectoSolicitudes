import { Routes } from '@angular/router';

// Guards
import { authGuard }   from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { roleGuard }  from './guards/role.guard';

// Componentes
import { Inicio }           from './componentes/inicio/inicio';
import { Login }            from './componentes/login/login';
import { ListaSolicitudes } from './componentes/solicitudes/lista-solicitudes/lista-solicitudes';
import { NuevaSolicitud }   from './componentes/solicitudes/nueva-solicitud/nueva-solicitud';
import { DetalleSolicitud } from './componentes/solicitudes/detalle-solicitud/detalle-solicitud';
import { ListaUsuarios }    from './componentes/usuarios/lista-usuarios/lista-usuarios';
import { CambiarPassword }  from './componentes/cambiar-password/cambiar-password';
import { Unauthorized }     from './componentes/unauthorized/unauthorized';

export const routes: Routes = [
  // ── Ruta raíz (pública)
  { path: '', component: Inicio },

  // ── Ruta pública — publicGuard evita que usuarios autenticados regresen al login
  { path: 'login', canActivate: [publicGuard], component: Login },

  // ── Rutas protegidas — requieren sesión activa (authGuard)
  { path: 'solicitudes',        canActivate: [authGuard], component: ListaSolicitudes },
  { path: 'solicitudes/nueva',  canActivate: [authGuard], component: NuevaSolicitud },
  { path: 'solicitudes/:id',    canActivate: [authGuard], component: DetalleSolicitud },
  { path: 'cambiar-password',   canActivate: [authGuard], component: CambiarPassword },

  // ── Ruta protegida por ROL — requiere sesión + rol ADMIN
  // authGuard verifica sesión, roleGuard verifica rol.
  // data.roles es leído por roleGuard en route.data['roles'].
  {
    path: 'usuarios',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    component: ListaUsuarios
  },

  // ── Página de acceso denegado (pública — no requiere sesión para verla)
  { path: 'unauthorized', component: Unauthorized },

  // ── Wildcard — cualquier ruta desconocida redirige al inicio
  { path: '**', pathMatch: 'full', redirectTo: '/' }
];