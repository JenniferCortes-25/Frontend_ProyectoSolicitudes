import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { Inicio } from './componentes/inicio/inicio';
import { Login } from './componentes/login/login';
import { ListaSolicitudes } from './componentes/solicitudes/lista-solicitudes/lista-solicitudes';
import { NuevaSolicitud } from './componentes/solicitudes/nueva-solicitud/nueva-solicitud';
import { DetalleSolicitud } from './componentes/solicitudes/detalle-solicitud/detalle-solicitud';
import { ListaUsuarios } from './componentes/usuarios/lista-usuarios/lista-usuarios';
import { CambiarPassword } from './componentes/cambiar-password/cambiar-password';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },
  //Rutas que requieren una sesion activa

  { path: 'solicitudes', canActivate: [authGuard], component: ListaSolicitudes },
  { path: 'solicitudes/nueva', canActivate: [authGuard], component: NuevaSolicitud },
  { path: 'solicitudes/:id', canActivate: [authGuard], component: DetalleSolicitud },
  //Rutas que requieren rol ADMIN
  { path: 'usuarios', canActivate: [authGuard, roleGuard], 
    data: { roles: ['ADMIN'] }, component: ListaUsuarios },
  { path: 'cambiar-password', canActivate: [authGuard], component: CambiarPassword },
  { path: '**', pathMatch: 'full', redirectTo: '/' },
];
