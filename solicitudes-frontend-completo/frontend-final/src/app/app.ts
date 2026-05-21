import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './componentes/navbar/navbar';
import { Footer } from './componentes/footer/footer';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from './servicios/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  private notificationService = inject(NotificationService);
  private messageService      = inject(MessageService);

  constructor() {
    effect(() => {
      const msg = this.notificationService.message();
      if (msg) {
        this.messageService.add({
          severity: msg.severity,
          summary:  msg.summary,
          detail:   msg.detail,
          life:     4000
        });
      }
    });
  }
}