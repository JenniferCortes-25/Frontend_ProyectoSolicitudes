import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { SolicitudResumenResponse, EstadoSolicitud } from '../../../dto/solicitud.dto';

@Component({
  selector: 'app-lista-solicitudes',
  imports: [RouterLink, SlicePipe, Card, Tag],
  templateUrl: './lista-solicitudes.html',
  styleUrl: './lista-solicitudes.css',
})
export class ListaSolicitudes {
  private svc = inject(SolicitudService);

  // ✅ toSignal() — Angular gestiona suscripción y cancelación automáticamente
  private todasLasSolicitudes = toSignal(this.svc.listar(), {
    initialValue: [] as SolicitudResumenResponse[],
  });

  filtroEstado = signal<EstadoSolicitud | ''>('');
  readonly estados: EstadoSolicitud[] = [
    'REGISTRADA',
    'CLASIFICADA',
    'EN_ATENCION',
    'ATENDIDA',
    'CERRADA',
  ];

  // Computed: filtra en el cliente sin nueva petición HTTP
  solicitudes = computed(() => {
    const filtro = this.filtroEstado();
    const todas = this.todasLasSolicitudes();
    return filtro ? todas.filter((s) => s.estado === filtro) : todas;
  });

  cambiarFiltro(valor: string): void {
    this.filtroEstado.set(valor as EstadoSolicitud | '');
  }

  // ✅ PrimeNG Tag severity — tipado union type
  tagSeveridad(estado: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const mapa: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> =
      {
        REGISTRADA: 'secondary',
        CLASIFICADA: 'info',
        EN_ATENCION: 'warn',
        ATENDIDA: 'success',
        CERRADA: 'contrast',
      };
    return mapa[estado] ?? 'secondary';
  }

  tagPrioridad(prioridad: string): 'success' | 'warn' | 'danger' {
    const mapa: Record<string, 'success' | 'warn' | 'danger'> = {
      BAJA: 'success',
      MEDIA: 'warn',
      ALTA: 'danger',
      CRITICA: 'danger',
    };
    return mapa[prioridad] ?? 'success';
  }
}
