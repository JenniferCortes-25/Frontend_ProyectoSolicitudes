import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CrearSolicitudRequest,
  ClasificarSolicitudRequest,
  AsignarResponsableRequest,
  IniciarAtencionRequest,
  AtenderSolicitudRequest,
  CerrarSolicitudRequest,
  SolicitudDetalleResponse,
  SolicitudResumenResponse,
  EstadoSolicitud,
  EventoHistorialResponse,
} from '../dto/solicitud.dto';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly API = 'http://localhost:8080/api/solicitudes';

  constructor(private http: HttpClient) {}

  // ── Consultas ────────────────────────────────────────────────────────────

  listar(estado?: EstadoSolicitud): Observable<SolicitudResumenResponse[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    return this.http.get<SolicitudResumenResponse[]>(this.API, { params });
  }

  obtenerPorId(id: string): Observable<SolicitudDetalleResponse> {
    return this.http.get<SolicitudDetalleResponse>(`${this.API}/${id}`);
  }

  obtenerHistorial(id: string): Observable<EventoHistorialResponse[]> {
    return this.http.get<EventoHistorialResponse[]>(`${this.API}/${id}/historial`);
  }

  // ── Crear ────────────────────────────────────────────────────────────────

  crear(request: CrearSolicitudRequest): Observable<SolicitudDetalleResponse> {
    return this.http.post<SolicitudDetalleResponse>(this.API, request);
  }

  // ── Acciones avanzadas ───────────────────────────────────────────────────

  clasificar(id: string, request: ClasificarSolicitudRequest): Observable<SolicitudDetalleResponse> {
    return this.http.put<SolicitudDetalleResponse>(`${this.API}/${id}/clasificar`, request);
  }

  asignarResponsable(id: string, request: AsignarResponsableRequest): Observable<SolicitudDetalleResponse> {
    return this.http.put<SolicitudDetalleResponse>(`${this.API}/${id}/asignar`, request);
  }

  iniciarAtencion(id: string, request: IniciarAtencionRequest): Observable<SolicitudDetalleResponse> {
    return this.http.put<SolicitudDetalleResponse>(`${this.API}/${id}/iniciar-atencion`, request);
  }

  atender(id: string, request: AtenderSolicitudRequest): Observable<SolicitudDetalleResponse> {
    return this.http.put<SolicitudDetalleResponse>(`${this.API}/${id}/atender`, request);
  }

  cerrar(id: string, request: CerrarSolicitudRequest): Observable<SolicitudDetalleResponse> {
    return this.http.put<SolicitudDetalleResponse>(`${this.API}/${id}/cerrar`, request);
  }
}
