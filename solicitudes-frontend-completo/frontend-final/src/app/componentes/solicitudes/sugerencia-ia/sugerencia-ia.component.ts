import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AsistenteIaService,
  SugerenciaIaResponse,
} from '../../../servicios/asistente-ia.service';

/**
 * Panel de sugerencia IA (RF-10).
 * Se muestra debajo del campo "descripción" en el formulario de nueva solicitud.
 * Emite (aceptarSugerencia) cuando el usuario confirma los valores sugeridos.
 */
@Component({
  selector: 'app-sugerencia-ia',
  standalone: true,  
  template: `
    <div class="ia-panel">
      <!-- Botón para pedir sugerencia -->
      <button
        type="button"
        class="btn-ia"
        [disabled]="descripcion.length < 10 || cargando()"
        (click)="pedir()"
      >
        @if (cargando()) {
          <span class="spinner"></span> Analizando…
        } @else {
          🤖 Sugerir tipo y prioridad con IA
        }
      </button>

      <!-- Resultado -->
      @if (sugerencia()) {
        <div class="ia-resultado" [class.ia-no-disponible]="!sugerencia()!.disponible">
          @if (sugerencia()!.disponible) {
            <p class="ia-titulo">💡 Sugerencia del asistente IA</p>
            <div class="ia-chips">
              <span class="chip chip-tipo">{{ sugerencia()!.tipoSugerido }}</span>
              <span class="chip chip-prioridad">{{ sugerencia()!.prioridadSugerida }}</span>
            </div>
            <p class="ia-justificacion">{{ sugerencia()!.justificacion }}</p>
            <p class="ia-aviso">⚠️ Estas son sugerencias. Un coordinador debe confirmar o ajustar antes de clasificar.</p>
            <button type="button" class="btn-aceptar" (click)="aceptar()">
              ✅ Usar esta sugerencia al clasificar
            </button>
          } @else {
            <p class="ia-no-disp-msg">⚠️ Servicio IA no disponible. Puedes continuar sin él.</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .ia-panel { margin-top: .75rem; }

    .btn-ia {
      background: #6366f1; color: white; border: none; border-radius: 6px;
      padding: .45rem 1rem; cursor: pointer; font-size: .875rem; display: flex;
      align-items: center; gap: .4rem; transition: background .2s;
    }
    .btn-ia:disabled { background: #a5b4fc; cursor: not-allowed; }
    .btn-ia:not(:disabled):hover { background: #4f46e5; }

    .spinner {
      width: 12px; height: 12px; border: 2px solid white;
      border-top-color: transparent; border-radius: 50%;
      animation: spin .7s linear infinite; display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .ia-resultado {
      margin-top: .6rem; padding: .75rem 1rem;
      background: #f0f9ff; border: 1px solid #bae6fd;
      border-radius: 8px;
    }
    .ia-no-disponible {
      background: #fff7ed; border-color: #fed7aa;
    }
    .ia-titulo { font-weight: 600; font-size: .875rem; margin: 0 0 .4rem; color: #1e40af; }
    .ia-chips { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .4rem; }
    .chip {
      padding: .2rem .6rem; border-radius: 999px;
      font-size: .78rem; font-weight: 600; text-transform: uppercase;
    }
    .chip-tipo     { background: #dbeafe; color: #1d4ed8; }
    .chip-prioridad { background: #dcfce7; color: #166534; }
    .ia-justificacion { font-size: .84rem; color: #374151; margin: .3rem 0; }
    .ia-aviso { font-size: .78rem; color: #92400e; margin: .4rem 0; }
    .btn-aceptar {
      background: #059669; color: white; border: none; border-radius: 6px;
      padding: .35rem .85rem; cursor: pointer; font-size: .82rem; margin-top: .3rem;
    }
    .btn-aceptar:hover { background: #047857; }
    .ia-no-disp-msg { font-size: .84rem; color: #92400e; margin: 0; }
  `],
})
export class SugerenciaIaComponent {
  @Input() descripcion = '';

  /** Emite la sugerencia cuando el usuario hace clic en "Usar esta sugerencia" */
  @Output() aceptarSugerencia = new EventEmitter<SugerenciaIaResponse>();

  private ia         = inject(AsistenteIaService);
  private destroyRef = inject(DestroyRef);

  cargando  = signal(false);
  sugerencia = signal<SugerenciaIaResponse | null>(null);

  pedir(): void {
    if (this.descripcion.length < 10) return;
    this.cargando.set(true);
    this.sugerencia.set(null);

    this.ia
      .sugerirClasificacion(this.descripcion)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => { this.sugerencia.set(s); this.cargando.set(false); },
        error: ()  => { this.cargando.set(false); },
      });
  }

  aceptar(): void {
    const s = this.sugerencia();
    if (s?.disponible) this.aceptarSugerencia.emit(s);
  }
}