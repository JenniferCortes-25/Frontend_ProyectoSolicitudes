import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG v21 - Componentes directos
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { IftaLabel } from 'primeng/iftalabel';
import { Fluid } from 'primeng/fluid';
import { Card } from 'primeng/card';

import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputText, Password, Button, Message, IftaLabel, Fluid, Card],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  loginForm = inject(FormBuilder).group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);
  result = signal('');

  private formStatus = toSignal(this.loginForm.statusChanges, { initialValue: 'INVALID' as const });

  canSubmit = computed(() => this.formStatus() === 'VALID' && !this.isLoading());

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value as { username: string; password: string };

    this.isLoading.set(true);
    this.result.set('');

    this.authService
      .login({ username, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.authService.estaAutenticado.set(true);
          this.router.navigate(['/lista-solicitudes']);
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          if (err && typeof err === 'object' && 'message' in err) {
            this.result.set((err as { message: string }).message || 'Error al iniciar sesión');
          } else {
            this.result.set('Error inesperado al iniciar sesión');
          }
        },
      });
  }
}
