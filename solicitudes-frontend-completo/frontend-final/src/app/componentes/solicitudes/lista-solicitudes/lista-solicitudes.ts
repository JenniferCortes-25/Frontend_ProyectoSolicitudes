import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { SolicitudResumenResponse, EstadoSolicitud } from '../../../dto/solicitud.dto';

@Component({
  selector: 'app-lista-solicitudes',
  imports: [RouterLink, SlicePipe],
  templateUrl: './lista-solicitudes.html',
  styleUrl: './lista-solicitudes.css',
})
export class ListaSolicitudes {
  private svc = inject(SolicitudService);

  // ✅ toSignal() — Angular gestiona suscripción y cancelación automáticamente
  private todasLasSolicitudes = toSignal(
    this.svc.listar(),
    { initialValue: [] as SolicitudResumenResponse[] }
  );

  filtroEstado = signal<EstadoSolicitud | ''>('');
  readonly estados: EstadoSolicitud[] = [
    'REGISTRADA', 'CLASIFICADA', 'EN_ATENCION', 'ATENDIDA', 'CERRADA'
  ];

  // Computed: filtra en el cliente sin nueva petición HTTP
  solicitudes = computed(() => {
    const filtro = this.filtroEstado();
    const todas  = this.todasLasSolicitudes();
    return filtro ? todas.filter(s => s.estado === filtro) : todas;
  });

  cambiarFiltro(valor: string): void {
    this.filtroEstado.set(valor as EstadoSolicitud | '');
  }

  badgeEstado(estado: string): string {
    const mapa: Record<string, string> = {
      REGISTRADA: 'bg-secondary',
      CLASIFICADA: 'bg-info text-dark',
      EN_ATENCION: 'bg-warning text-dark',
      ATENDIDA: 'bg-success',
      CERRADA: 'bg-dark',
    };
    return mapa[estado] ?? 'bg-secondary';
  }

  badgePrioridad(prioridad: string): string {
    const mapa: Record<string, string> = {
      BAJA: 'bg-success',
      MEDIA: 'bg-warning text-dark',
      ALTA: 'bg-danger',
      CRITICA: 'bg-danger',
    };
    return mapa[prioridad] ?? 'bg-secondary';
  }
}