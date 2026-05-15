import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { UsuarioService } from '../../servicios/usuario.service';
@Component({
  selector: 'app-cambiar-password',
  imports: [],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.css',
  standalone: true,
})
export class CambiarPassword {
  private auth = inject(AuthService);
  private svc = inject(UsuarioService);
  private router = inject(Router);

  passwordActual = signal('');
  passwordNueva = signal('');
  passwordConf = signal('');
  error = signal('');
  exito = signal('');
  cargando = signal(false);

  cambiar(): void {
    this.error.set('');
    this.exito.set('');

    if (!this.passwordActual().trim() || !this.passwordNueva().trim()) {
      this.error.set('Completa todos los campos.');
      return;
    }
    if (this.passwordNueva().length < 8) {
      this.error.set('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (this.passwordNueva() !== this.passwordConf()) {
      this.error.set('Las contraseñas nuevas no coinciden.');
      return;
    }

    // Buscar el usuario por email del token
    const email = this.auth.getEmail();
    if (!email) {
      this.error.set('No se pudo identificar al usuario. Inicia sesión de nuevo.');
      return;
    }

    this.cargando.set(true);

    // Primero listar usuarios para encontrar el ID por email
    this.svc.listar().subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(u => u.email === email);
        if (!usuario) {
          this.error.set('No se encontró el usuario. Inicia sesión de nuevo.');
          this.cargando.set(false);
          return;
        }
        this.svc.cambiarPassword(usuario.id, {
          passwordActual: this.passwordActual(),
          passwordNueva:  this.passwordNueva(),
        }).subscribe({
          next: () => {
            this.exito.set('✅ Contraseña actualizada. Inicia sesión de nuevo.');
            this.cargando.set(false);
            setTimeout(() => {
              this.auth.logout();
              this.router.navigate(['/login']);
            }, 2500);
          },
          error: (err: any) => {
            this.error.set(err?.error?.message ?? 'La contraseña actual es incorrecta.');
            this.cargando.set(false);
          },
        });
      },
      error: () => {
        this.error.set('Error al obtener datos del usuario.');
        this.cargando.set(false);
      },
    });
  }
}
