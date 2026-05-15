import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  auth = inject(AuthService);
  bienvenida = signal('Sistema de Gestión de Solicitudes Académicas');
  subtitulo = signal('Registra, consulta y gestiona solicitudes de forma eficiente.');
}
