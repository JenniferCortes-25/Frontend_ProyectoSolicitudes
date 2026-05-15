import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CambiarPasswordRequest,
  CrearUsuarioRequest,
  UsuarioDetalleResponse,
  UsuarioResumenResponse,
} from '../dto/usuario.dto';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly API = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioResumenResponse[]> {
    return this.http.get<UsuarioResumenResponse[]>(this.API);
  }

  obtenerPorId(id: string): Observable<UsuarioDetalleResponse> {
    return this.http.get<UsuarioDetalleResponse>(`${this.API}/${id}`);
  }

  crear(request: CrearUsuarioRequest): Observable<UsuarioDetalleResponse> {
    return this.http.post<UsuarioDetalleResponse>(this.API, request);
  }

  activar(id: string): Observable<UsuarioDetalleResponse> {
    return this.http.put<UsuarioDetalleResponse>(`${this.API}/${id}/activar`, {});
  }

  desactivar(id: string): Observable<UsuarioDetalleResponse> {
    return this.http.put<UsuarioDetalleResponse>(`${this.API}/${id}/desactivar`, {});
  }

  cambiarPassword(id: string, request: CambiarPasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.API}/${id}/cambiar-password`, request);
  }
}
