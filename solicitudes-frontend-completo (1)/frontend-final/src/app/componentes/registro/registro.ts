import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { TipoUsuario } from '../../dto/usuario.dto';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
  standalone: true,
})
export class Registro {
  router = inject(Router);
  usuarioSvc = inject(UsuarioService);

  identificacion = signal('');
  nombre = signal('');
  email = signal('');
  tipoUsuario = signal<TipoUsuario>('ESTUDIANTE');
  error = signal('');
  exito = signal('');
  cargando = signal(false);

  readonly tipos: TipoUsuario[] = ['ESTUDIANTE', 'DOCENTE', 'ADMINISTRATIVO'];

  registrar(): void {
    if (!this.identificacion() || !this.nombre() || !this.email()) {
      this.error.set('Completa todos los campos.');
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    this.exito.set('');

    this.usuarioSvc
      .crear({
        identificacion: this.identificacion(),
        nombre: this.nombre(),
        email: this.email(),
        tipoUsuario: this.tipoUsuario(),
      })
      .subscribe({
        next: () => {
          this.exito.set('¡Usuario creado! Ahora puedes iniciar sesión.');
          this.cargando.set(false);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err: any) => {
          this.error.set(err?.error?.message ?? 'Error al registrar. Verifica los datos.');
          this.cargando.set(false);
        },
      });
  }
}
