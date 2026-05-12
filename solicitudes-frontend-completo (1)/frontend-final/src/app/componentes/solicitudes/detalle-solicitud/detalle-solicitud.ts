import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { SolicitudService } from '../../../servicios/solicitud.service';
import {
  SolicitudDetalleResponse,
  EventoHistorialResponse,
  TipoSolicitud,
  NivelPrioridad,
} from '../../../dto/solicitud.dto';

@Component({
  selector: 'app-detalle-solicitud',
  imports: [RouterLink, SlicePipe],
  templateUrl: './detalle-solicitud.html',
  styleUrl: './detalle-solicitud.css',
})
export class DetalleSolicitud implements OnInit {
  private route = inject(ActivatedRoute);
  private svc   = inject(SolicitudService);

  solicitud  = signal<SolicitudDetalleResponse | null>(null);
  historial  = signal<EventoHistorialResponse[]>([]);
  cargando   = signal(true);
  error      = signal('');
  mensaje    = signal('');
  accionando = signal(false);

  readonly tipos: TipoSolicitud[] = [
    'HOMOLOGACION', 'REGISTRO_ASIGNATURA', 'CANCELACION_ASIGNATURA',
    'SOLICITUD_CUPO', 'CONSULTA_ACADEMICA', 'OTRO',
  ];
  readonly niveles: NivelPrioridad[] = ['CRITICA', 'ALTA', 'MEDIA', 'BAJA'];

  // Clasificar — usa identificacion del coordinador (ej: C-001)
  fTipo          = signal<TipoSolicitud>('HOMOLOGACION');
  fNivel         = signal<NivelPrioridad>('MEDIA');
  fJustificacion = signal('');
  fCoordinadorId = signal('');   // identificacion, no UUID

  // Asignar responsable — identificaciones
  fResponsableId  = signal('');  // identificacion del responsable
  fCoordAsignarId = signal('');  // identificacion del coordinador

  // Iniciar atención — identificacion del coordinador
  fCoordIniciarId = signal('');

  // Atender — identificacion del responsable
  fObservacionAtender    = signal('');
  fResponsableAtenderId  = signal('');  // identificacion del responsable

  // Cerrar — identificacion del coordinador
  fObservacionCerrar = signal('');
  fCoordCerrarId     = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.cargarSolicitud(id);
  }

  private cargarSolicitud(id: string): void {
    this.cargando.set(true);
    this.svc.obtenerPorId(id).subscribe({
      next: data => { this.solicitud.set(data); this.cargarHistorial(id); },
      error: () => { this.error.set('No se encontró la solicitud o hubo un error de conexión.'); this.cargando.set(false); },
    });
  }

  private cargarHistorial(id: string): void {
    this.svc.obtenerHistorial(id).subscribe({
      next: h => { this.historial.set(h); this.cargando.set(false); },
      error: () => { this.cargando.set(false); },
    });
  }

  private recargar(): void {
    this.mensaje.set('');
    this.error.set('');
    this.cargarSolicitud(this.solicitud()!.id);
  }

  clasificar(): void {
    if (!this.fJustificacion().trim() || !this.fCoordinadorId().trim()) {
      this.error.set('Completa todos los campos del formulario.');
      return;
    }
    this.accionando.set(true);
    this.error.set('');
    this.svc.clasificar(this.solicitud()!.id, {
      tipo:                   this.fTipo(),
      nivelPrioridad:         this.fNivel(),
      justificacionPrioridad: this.fJustificacion(),
      coordinadorId:          this.fCoordinadorId(),   // se manda la identificacion
    }).subscribe({
      next: () => { this.mensaje.set('✅ Solicitud clasificada correctamente.'); this.accionando.set(false); this.recargar(); },
      error: err => { this.error.set(err?.error?.message ?? 'Error al clasificar. Verifica la identificación del coordinador.'); this.accionando.set(false); },
    });
  }

  asignarResponsable(): void {
    if (!this.fResponsableId().trim() || !this.fCoordAsignarId().trim()) {
      this.error.set('Completa todos los campos del formulario.');
      return;
    }
    this.accionando.set(true);
    this.error.set('');
    this.svc.asignarResponsable(this.solicitud()!.id, {
      responsableId: this.fResponsableId(),   // identificacion
      coordinadorId: this.fCoordAsignarId(),  // identificacion
    }).subscribe({
      next: () => { this.mensaje.set('✅ Responsable asignado correctamente.'); this.accionando.set(false); this.recargar(); },
      error: err => { this.error.set(err?.error?.message ?? 'Error al asignar responsable. Verifica las identificaciones.'); this.accionando.set(false); },
    });
  }

  iniciarAtencion(): void {
    if (!this.fCoordIniciarId().trim()) {
      this.error.set('Ingresa la identificación del coordinador.');
      return;
    }
    this.accionando.set(true);
    this.error.set('');
    this.svc.iniciarAtencion(this.solicitud()!.id, {
      coordinadorId: this.fCoordIniciarId(),  // identificacion
    }).subscribe({
      next: () => { this.mensaje.set('✅ Atención iniciada correctamente.'); this.accionando.set(false); this.recargar(); },
      error: err => { this.error.set(err?.error?.message ?? 'Error al iniciar atención.'); this.accionando.set(false); },
    });
  }

  atender(): void {
    if (this.fObservacionAtender().length < 10 || !this.fResponsableAtenderId().trim()) {
      this.error.set('La observación debe tener al menos 10 caracteres e ingresar la identificación del responsable.');
      return;
    }
    this.accionando.set(true);
    this.error.set('');
    this.svc.atender(this.solicitud()!.id, {
      observacion:   this.fObservacionAtender(),
      responsableId: this.fResponsableAtenderId(),  // identificacion
    }).subscribe({
      next: () => { this.mensaje.set('✅ Solicitud marcada como atendida.'); this.accionando.set(false); this.recargar(); },
      error: err => { this.error.set(err?.error?.message ?? 'Error al atender. Verifica que seas el responsable asignado.'); this.accionando.set(false); },
    });
  }

  cerrar(): void {
    if (this.fObservacionCerrar().length < 20 || !this.fCoordCerrarId().trim()) {
      this.error.set('La observación de cierre debe tener al menos 20 caracteres e ingresar la identificación del coordinador.');
      return;
    }
    this.accionando.set(true);
    this.error.set('');
    this.svc.cerrar(this.solicitud()!.id, {
      observacion:   this.fObservacionCerrar(),
      coordinadorId: this.fCoordCerrarId(),  // identificacion
    }).subscribe({
      next: () => { this.mensaje.set('✅ Solicitud cerrada correctamente.'); this.accionando.set(false); this.recargar(); },
      error: err => { this.error.set(err?.error?.message ?? 'Error al cerrar. Verifica la identificación del coordinador.'); this.accionando.set(false); },
    });
  }

  colorEstado(estado: string): string {
    const c: Record<string, string> = {
      REGISTRADA: '#805ad5', CLASIFICADA: '#2b6cb0',
      EN_ATENCION: '#d69e2e', ATENDIDA: '#38a169', CERRADA: '#718096',
    };
    return c[estado] ?? '#2d3748';
  }
}
