import { Routes } from '@angular/router';
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
  { path: 'solicitudes', component: ListaSolicitudes },
  { path: 'solicitudes/nueva', component: NuevaSolicitud },
  { path: 'solicitudes/:id', component: DetalleSolicitud },
  { path: 'usuarios', component: ListaUsuarios },
  { path: 'cambiar-password', component: CambiarPassword },
  { path: '**', pathMatch: 'full', redirectTo: '/' },
];
