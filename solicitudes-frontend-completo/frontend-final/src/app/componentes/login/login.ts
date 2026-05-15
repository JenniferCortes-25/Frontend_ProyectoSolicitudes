import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router      = inject(Router);
  private destroyRef  = inject(DestroyRef);

  // ── Modelo del formulario (sin constructor, usando inject())
  loginForm = inject(FormBuilder).group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // ── Estado de UI con signals
  isLoading = signal(false);
  result    = signal('');

  // ── Puente Observable → Signal: estado del formulario
  formStatus = toSignal(this.loginForm.statusChanges, {
    initialValue: 'INVALID' as const,
  });

  // ── Estado derivado: ¿se puede enviar?
  canSubmit = computed(() =>
    this.formStatus() === 'VALID' && !this.isLoading()
  );

  onSubmit(): void {
    if (!this.canSubmit()) return;

    this.isLoading.set(true);
    this.result.set('');

    this.authService
      .login({
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.result.set('Sesión iniciada correctamente');
          this.router.navigate(['/solicitudes']);
        },
        error: () => {
          this.isLoading.set(false);
          this.result.set('Credenciales inválidas. Verifica tu correo y contraseña.');
        },
      });
  }
}