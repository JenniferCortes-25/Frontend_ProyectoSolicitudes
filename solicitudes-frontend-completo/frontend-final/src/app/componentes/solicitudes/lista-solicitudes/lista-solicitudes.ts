import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { switchMap, catchError, of, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Tag } from 'primeng/tag';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { NotificationService } from '../../../servicios/notification.service';
import { SolicitudResumenResponse } from '../../../dto/solicitud.dto';
import { PageResponse } from '../../../dto/page-response';

const EMPTY_PAGE: PageResponse<SolicitudResumenResponse> = {
  content: [], totalElements: 0, totalPages: 0, size: 5, number: 0
};

@Component({
  selector: 'app-lista-solicitudes',
  imports: [RouterLink, SlicePipe, TableModule, Paginator, ProgressSpinner, Tag],
  templateUrl: './lista-solicitudes.html',
  styleUrl: './lista-solicitudes.css',
})
export class ListaSolicitudes implements OnInit {
  private svc                 = inject(SolicitudService);
  private notificationService = inject(NotificationService);

  page    = signal(0);
  size    = signal(5);
  refresh = signal(0);        // <-- se incrementa cada vez que se entra a la pantalla
  loading = signal(true);

  // params incluye refresh, así el observable se dispara al entrar y al paginar
  private params = computed(() => ({
    page: this.page(),
    size: this.size(),
    refresh: this.refresh(),
  }));

  paginatedData = toSignal(
    toObservable(this.params).pipe(
      tap(() => this.loading.set(true)),
      switchMap(p =>
        this.svc.listarPaginado(p.page, p.size).pipe(
          catchError(() => {
            this.notificationService.error('Error', 'No se pudo cargar el listado.');
            return of(EMPTY_PAGE);
          })
        )
      ),
      tap(() => this.loading.set(false))
    ),
    { initialValue: undefined }
  );

  private safePage = computed(() => {
    const data = this.paginatedData();
    if (!data || !Array.isArray(data.content)) return EMPTY_PAGE;
    return data;
  });

  solicitudes   = computed(() => this.safePage().content);
  totalElements = computed(() => this.safePage().totalElements);
  cargando      = computed(() => this.loading());

  // Cada vez que Angular activa esta vista, forzamos un nuevo fetch
  ngOnInit(): void {
    this.refresh.update(v => v + 1);
  }

  onPageChange(event: PaginatorState): void {
    this.page.set(event.page ?? 0);
    this.size.set(event.rows ?? 5);
  }

  tagSeveridad(estado: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const mapa: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      REGISTRADA:  'secondary',
      CLASIFICADA: 'info',
      EN_ATENCION: 'warn',
      ATENDIDA:    'success',
      CERRADA:     'contrast',
    };
    return mapa[estado] ?? 'secondary';
  }

  tagPrioridad(prioridad: string): 'success' | 'warn' | 'danger' {
    const mapa: Record<string, 'success' | 'warn' | 'danger'> = {
      BAJA:    'success',
      MEDIA:   'warn',
      ALTA:    'danger',
      CRITICA: 'danger',
    };
    return mapa[prioridad] ?? 'success';
  }
}