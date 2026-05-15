import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './componentes/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  title = signal('Sistema de Solicitudes');
  footer = signal('Universidad del Quindío — Ingeniería de Sistemas y Computación');
}
