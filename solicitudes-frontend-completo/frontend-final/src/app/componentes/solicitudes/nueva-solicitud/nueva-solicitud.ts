import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { CanalOrigen } from '../../../dto/solicitud.dto';

@Component({
  selector: 'app-nueva-solicitud',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './nueva-solicitud.html',
  styleUrl: './nueva-solicitud.css',
})
export class NuevaSolicitud {
  private svc        = inject(SolicitudService);
  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  // ── Estado de UI
  isLoading = signal(false);
  result    = signal('');

  // ── Opciones del enum CanalOrigen del backend
  readonly canales: CanalOrigen[] = [
    'PRESENCIAL',
    'CORREO_ELECTRONICO',
    'TELEFONICO',
    'SAC',
    'CSU',
  ];

  // ── Modelo del formulario (sin constructor)
  solicitudForm = inject(FormBuilder).group({
    descripcion:   ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    canalOrigen:   ['' as CanalOrigen, Validators.required],
    solicitanteId: ['', Validators.required],
  });

  // ── Puente Observable → Signal
  formStatus = toSignal(this.solicitudForm.statusChanges, {
    initialValue: 'INVALID' as const,
  });

  // ── Estado derivado
  canSubmit = computed(() =>
    this.formStatus() === 'VALID' && !this.isLoading()
  );

  // Contador de caracteres para descripción
  charCount = computed(() =>
    this.solicitudForm.get('descripcion')?.value?.length ?? 0
  );

  onSubmit(): void {
    if (!this.canSubmit()) return;

    this.isLoading.set(true);
    this.result.set('');

    const { descripcion, canalOrigen, solicitanteId } = this.solicitudForm.value;

    this.svc
      .crear({
        descripcion:   descripcion!,
        canalOrigen:   canalOrigen!,
        solicitanteId: solicitanteId!,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => {
          this.router.navigate(['/solicitudes', s.id]);
        },
        error: (err) => {
          this.result.set(err?.error?.message ?? 'Error al crear la solicitud.');
          this.isLoading.set(false);
        },
      });
  }
}