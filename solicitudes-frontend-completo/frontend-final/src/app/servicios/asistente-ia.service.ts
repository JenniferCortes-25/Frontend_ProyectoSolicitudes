import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface SugerenciaIaResponse {
  tipoSugerido: string;
  prioridadSugerida: string;
  justificacion: string;
  disponible: boolean;
}

export interface ResumenIaResponse {
  resumen: string;
  disponible: boolean;
}

/**
 * Servicio Angular para consumir los endpoints del Asistente IA.
 * RF-09: resumen de historial  |  RF-10: sugerencia de clasificación
 */
@Injectable({ providedIn: 'root' })
export class AsistenteIaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/ia';

  /**
   * RF-10 – Solicita sugerencia de tipo y prioridad al backend.
   * Nunca lanza error: retorna disponible=false si hay fallo de red.
   */
  sugerirClasificacion(descripcion: string): Observable<SugerenciaIaResponse> {
    return this.http
      .post<SugerenciaIaResponse>(`${this.baseUrl}/sugerir-clasificacion`, { descripcion })
      .pipe(
        catchError(() =>
          of({
            tipoSugerido: 'OTRO',
            prioridadSugerida: 'MEDIA',
            justificacion: 'Servicio IA no disponible.',
            disponible: false,
          })
        )
      );
  }

  /**
   * RF-09 – Solicita resumen ejecutivo de la solicitud indicada.
   * Nunca lanza error: retorna disponible=false si hay fallo de red.
   */
  generarResumen(solicitudId: string): Observable<ResumenIaResponse> {
    return this.http
      .get<ResumenIaResponse>(`${this.baseUrl}/resumen/${solicitudId}`)
      .pipe(
        catchError(() =>
          of({ resumen: 'Servicio IA no disponible.', disponible: false })
        )
      );
  }
}