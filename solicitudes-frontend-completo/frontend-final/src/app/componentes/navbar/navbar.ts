import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true,
})
export class Navbar {
  auth   = inject(AuthService);
  router = inject(Router);

  // Acceso directo a los signals — el template los llama como funciones
  isLoggedIn   = this.auth.estaAutenticado;
  isAdmin      = this.auth.isAdmin;
  isCoordinador= this.auth.isCoordinador;
  isDocente    = this.auth.isDocente;
  userEmail    = () => this.auth.getEmail() ?? 'Usuario';

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}