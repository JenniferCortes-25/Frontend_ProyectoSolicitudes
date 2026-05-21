import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsistenteIaService } from '../../../servicios/asistente-ia.service';

/**
 * Panel de resumen IA (RF-09).
 * Se agrega en la vista de detalle de una solicitud (detalle-solicitud.html).
 * El resumen se carga bajo demanda con el botón.
 */
@Component({
  selector: 'app-resumen-ia',
  standalone: true,  
  template: `
    <div class="resumen-ia-panel">
      <button
        type="button"
        class="btn-resumen"
        [disabled]="cargando()"
        (click)="cargar()"
      >
        @if (cargando()) {
          <span class="spinner"></span> Generando resumen…
        } @else {
          🤖 Generar resumen con IA
        }
      </button>

      @if (resumen()) {
        <div class="resumen-resultado" [class.no-disp]="!disponible()">
          @if (disponible()) {
            <p class="resumen-label">📄 Resumen generado por IA</p>
            <p class="resumen-texto">{{ resumen() }}</p>
            <p class="resumen-aviso">Este resumen es orientativo y puede no reflejar todos los detalles.</p>
          } @else {
            <p class="no-disp-msg">⚠️ Servicio IA no disponible actualmente.</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .resumen-ia-panel { margin: 1rem 0; }

    .btn-resumen {
      background: #7c3aed; color: white; border: none; border-radius: 6px;
      padding: .45rem 1rem; cursor: pointer; font-size: .875rem; display: flex;
      align-items: center; gap: .4rem; transition: background .2s;
    }
    .btn-resumen:disabled { background: #c4b5fd; cursor: not-allowed; }
    .btn-resumen:not(:disabled):hover { background: #6d28d9; }

    .spinner {
      width: 12px; height: 12px; border: 2px solid white;
      border-top-color: transparent; border-radius: 50%;
      animation: spin .7s linear infinite; display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .resumen-resultado {
      margin-top: .6rem; padding: .8rem 1rem;
      background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px;
    }
    .no-disp { background: #fff7ed; border-color: #fed7aa; }
    .resumen-label { font-weight: 600; font-size: .875rem; margin: 0 0 .4rem; color: #5b21b6; }
    .resumen-texto { font-size: .9rem; color: #1f2937; line-height: 1.5; margin: 0 0 .4rem; white-space: pre-wrap; }
    .resumen-aviso { font-size: .75rem; color: #6b7280; margin: 0; }
    .no-disp-msg   { font-size: .84rem; color: #92400e; margin: 0; }
  `],
})
export class ResumenIaComponent implements OnChanges {
  /** ID de la solicitud a resumir */
  @Input() solicitudId = '';

  private ia         = inject(AsistenteIaService);
  private destroyRef = inject(DestroyRef);

  cargando   = signal(false);
  resumen    = signal<string | null>(null);
  disponible = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['solicitudId']) {
      // Limpiar resumen anterior al cambiar de solicitud
      this.resumen.set(null);
      this.disponible.set(false);
    }
  }

  cargar(): void {
    if (!this.solicitudId) return;
    this.cargando.set(true);

    this.ia
      .generarResumen(this.solicitudId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.resumen.set(r.resumen);
          this.disponible.set(r.disponible);
          this.cargando.set(false);
        },
        error: () => { this.cargando.set(false); },
      });
  }
}