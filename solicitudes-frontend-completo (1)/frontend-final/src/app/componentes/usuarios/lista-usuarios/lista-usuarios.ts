import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../servicios/usuario.service';
import { UsuarioResumenResponse, TipoUsuario } from '../../../dto/usuario.dto';

@Component({
  selector: 'app-lista-usuarios',
  imports: [],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
  standalone: true,
})
export class ListaUsuarios implements OnInit {
  private svc = inject(UsuarioService);

  usuarios = signal<UsuarioResumenResponse[]>([]);
  cargando = signal(true);
  error = signal('');
  mensaje = signal('');

  // ── Formulario crear usuario ──────────────────────────────────────────────
  mostrarFormCrear = signal(false);
  creando = signal(false);
  fIdentificacion = signal('');
  fNombre = signal('');
  fEmail = signal('');
  fTipo = signal<TipoUsuario>('ESTUDIANTE');
  readonly tipos: TipoUsuario[] = ['ESTUDIANTE', 'DOCENTE', 'COORDINADOR', 'ADMINISTRATIVO'];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.svc.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de usuarios.');
        this.cargando.set(false);
      },
    });
  }

  toggleFormCrear(): void {
    this.mostrarFormCrear.set(!this.mostrarFormCrear());
    this.error.set('');
    this.mensaje.set('');
  }

  crearUsuario(): void {
    if (!this.fIdentificacion().trim() || !this.fNombre().trim() || !this.fEmail().trim()) {
      this.error.set('Completa todos los campos.');
      return;
    }
    this.creando.set(true);
    this.error.set('');
    this.svc
      .crear({
        identificacion: this.fIdentificacion(),
        nombre: this.fNombre(),
        email: this.fEmail(),
        tipoUsuario: this.fTipo(),
      })
      .subscribe({
        next: () => {
          this.mensaje.set(`✅ Usuario creado. Contraseña por defecto: Password123`);
          this.creando.set(false);
          this.mostrarFormCrear.set(false);
          this.fIdentificacion.set('');
          this.fNombre.set('');
          this.fEmail.set('');
          this.fTipo.set('ESTUDIANTE');
          this.cargar();
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Error al crear usuario.');
          this.creando.set(false);
        },
      });
  }

  cambiarEstado(u: UsuarioResumenResponse): void {
    const accion =
      u.estadoUsuario === 'ACTIVO' ? this.svc.desactivar(u.id) : this.svc.activar(u.id);

    accion.subscribe({
      next: () => {
        this.mensaje.set(
          `✅ Usuario ${u.estadoUsuario === 'ACTIVO' ? 'desactivado' : 'activado'}.`,
        );
        this.cargar();
      },
      error: (err) => this.error.set(err?.error?.message ?? 'Error al cambiar estado.'),
    });
  }

  colorTipo(tipo: string): string {
    const c: Record<string, string> = {
      ESTUDIANTE: '#6b46c1',
      DOCENTE: '#2b6cb0',
      COORDINADOR: '#c05621',
      ADMINISTRATIVO: '#276749',
    };
    return c[tipo] ?? '#718096';
  }
}
