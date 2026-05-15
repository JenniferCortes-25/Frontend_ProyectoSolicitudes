import { Component, signal, inject, OnInit } from '@angular/core';
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
export class ListaSolicitudes implements OnInit {
  private svc = inject(SolicitudService);

  solicitudes = signal<SolicitudResumenResponse[]>([]);
  cargando    = signal(true);
  error       = signal('');
  filtroEstado = signal<EstadoSolicitud | ''>('');

  readonly estados: EstadoSolicitud[] = [
    'REGISTRADA', 'CLASIFICADA', 'EN_ATENCION', 'ATENDIDA', 'CERRADA'
  ];

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    const estado = this.filtroEstado() || undefined;
    this.svc.listar(estado as EstadoSolicitud).subscribe({
      next: data => { this.solicitudes.set(data); this.cargando.set(false); },
      error: ()  => { this.error.set('No se pudo cargar la lista. ¿Está el backend corriendo?'); this.cargando.set(false); },
    });
  }

  cambiarFiltro(valor: string): void {
    this.filtroEstado.set(valor as EstadoSolicitud | '');
    this.cargar();
  }

  colorEstado(estado: string): string {
    const colores: Record<string, string> = {
      REGISTRADA: '#805ad5', CLASIFICADA: '#2b6cb0', EN_ATENCION: '#d69e2e',
      ATENDIDA: '#38a169', CERRADA: '#718096',
    };
    return colores[estado] ?? '#2d3748';
  }
}
