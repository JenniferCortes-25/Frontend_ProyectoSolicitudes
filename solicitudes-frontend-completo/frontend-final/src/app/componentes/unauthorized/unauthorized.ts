import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Unauthorized — Página mostrada cuando el usuario no tiene el rol requerido.
 *
 * rolesGuard redirige aquí cuando:
 *   - El usuario SÍ está autenticado
 *   - Pero NO tiene el rol necesario para la ruta
 *
 * Es pública (no lleva canActivate) para que sea siempre accesible.
 */
@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unauthorized.html'
})
export class Unauthorized {}