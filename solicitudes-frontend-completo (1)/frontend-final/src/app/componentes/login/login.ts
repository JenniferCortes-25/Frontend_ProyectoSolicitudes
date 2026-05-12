import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router  = inject(Router);
  auth    = inject(AuthService);

  username = signal('');
  password = signal('');
  error    = signal('');
  cargando = signal(false);

  iniciarSesion(): void {
    if (!this.username() || !this.password()) {
      this.error.set('Completa todos los campos.');
      return;
    }
    this.cargando.set(true);
    this.error.set('');

    this.auth.login({ username: this.username(), password: this.password() }).subscribe({
      next: () => this.router.navigate(['/solicitudes']),
      error: () => {
        this.error.set('Credenciales incorrectas. Intenta de nuevo.');
        this.cargando.set(false);
      },
    });
  }
}
