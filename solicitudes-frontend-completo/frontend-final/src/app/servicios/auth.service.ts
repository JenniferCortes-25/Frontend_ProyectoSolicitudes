import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, TokenResponse } from '../dto/usuario.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API       = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY  = 'auth_user_id';

  estaAutenticado = signal(!!localStorage.getItem(this.TOKEN_KEY));

  constructor(private http: HttpClient) {}

  login(credenciales: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.API}/auth/login`, credenciales).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        // Decodificar el payload del JWT para obtener el userId
        const payload = JSON.parse(atob(res.token.split('.')[1]));
        if (payload.userId) localStorage.setItem(this.USER_KEY, payload.userId);
        this.estaAutenticado.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.estaAutenticado.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  /** Decodifica el email del token para mostrar info del usuario */
  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? null;
    } catch { return null; }
  }
}
