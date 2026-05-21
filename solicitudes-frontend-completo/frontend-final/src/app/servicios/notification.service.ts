import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
}

/**
 * Servicio singleton de notificaciones globales.
 * Cualquier componente, servicio o interceptor puede invocarlo.
 * App.ts escucha el signal y lo publica en p-toast.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  message = signal<ToastMessage | null>(null);

  success(summary: string, detail: string): void {
    this.message.set({ severity: 'success', summary, detail });
  }

  error(summary: string, detail: string): void {
    this.message.set({ severity: 'error', summary, detail });
  }

  warn(summary: string, detail: string): void {
    this.message.set({ severity: 'warn', summary, detail });
  }

  info(summary: string, detail: string): void {
    this.message.set({ severity: 'info', summary, detail });
  }
}