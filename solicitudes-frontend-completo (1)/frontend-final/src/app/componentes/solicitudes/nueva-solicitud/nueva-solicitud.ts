import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { CanalOrigen } from '../../../dto/solicitud.dto';

@Component({
  selector: 'app-nueva-solicitud',
  imports: [RouterLink],
  templateUrl: './nueva-solicitud.html',
  styleUrl: './nueva-solicitud.css',
})
export class NuevaSolicitud {
  private svc    = inject(SolicitudService);
  private router = inject(Router);

  descripcion   = signal('');
  canalOrigen   = signal<CanalOrigen>('CORREO_ELECTRONICO');
  solicitanteId = signal('');
  error         = signal('');
  cargando      = signal(false);

  readonly canales: CanalOrigen[] = [
    'PRESENCIAL', 'CORREO_ELECTRONICO', 'TELEFONICO', 'SAC', 'CSU'
  ];

  enviar(): void {
    if (this.descripcion().length < 10) {
      this.error.set('La descripción debe tener al menos 10 caracteres.'); return;
    }
    if (!this.solicitanteId().trim()) {
      this.error.set('La identificación del solicitante es obligatoria.'); return;
    }
    this.cargando.set(true);
    this.error.set('');

    this.svc.crear({
      descripcion:   this.descripcion(),
      canalOrigen:   this.canalOrigen(),
      solicitanteId: this.solicitanteId(),
    }).subscribe({
      next: (s) => this.router.navigate(['/solicitudes', s.id]),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al crear la solicitud.');
        this.cargando.set(false);
      },
    });
  }
}
