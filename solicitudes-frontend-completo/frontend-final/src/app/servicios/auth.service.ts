import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, TokenResponse } from '../dto/usuario.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API       = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY  = 'auth_user_id';
  private readonly ROLES_KEY = 'auth_roles';

  // ── Signals públicos — cualquier componente puede leerlos reactivamente
  estaAutenticado = signal(!!localStorage.getItem(this.TOKEN_KEY));
  roles = signal<string[]>(this.getRolesFromStorage());

  // ── Computed signals: evitan repetir lógica en cada componente
  isAdmin       = computed(() => this.roles().includes('ADMIN'));
  isCoordinador = computed(() => this.roles().includes('COORDINADOR'));
  isEstudiante  = computed(() => this.roles().includes('ESTUDIANTE'));
  isDocente     = computed(() => this.roles().includes('DOCENTE'));

  constructor(private http: HttpClient) {}

  login(credenciales: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.API}/auth/login`, credenciales
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);

        // Decodificar JWT y extraer payload (la parte central del token)
        const payload = JSON.parse(atob(res.token.split('.')[1]));

        if (payload.userId)
          localStorage.setItem(this.USER_KEY, payload.userId);

        // Los roles pueden venir como 'roles', 'authorities' o 'role' según el backend
        const rolesJwt: string[] = payload.roles
          ?? payload.authorities
          ?? (payload.role ? [payload.role] : []);

        localStorage.setItem(this.ROLES_KEY, JSON.stringify(rolesJwt));

        // Actualizar signals — dispara reactividad en todos los componentes suscritos
        this.estaAutenticado.set(true);
        this.roles.set(rolesJwt);
      })
    );
  }

  logout(): void {
    [this.TOKEN_KEY, this.USER_KEY, this.ROLES_KEY]
      .forEach(k => localStorage.removeItem(k));

    // Limpiar signals — la navbar y guards reaccionan inmediatamente
    this.estaAutenticado.set(false);
    this.roles.set([]);
  }

  /** Verifica si el usuario tiene un rol específico */
  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  /**
   * getRoles() — Requerido por rolesGuard (Guía 18).
   * Retorna los roles actuales desde el signal (fuente de verdad reactiva).
   * También puede leerse desde localStorage como fallback.
   */
  getRoles(): string[] {
    return this.roles();
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  getUserId(): string | null { return localStorage.getItem(this.USER_KEY); }

  /** Extrae el email (subject) del JWT decodificado */
  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? null;
    } catch { return null; }
  }

  /** Lee roles desde localStorage — usado solo en la inicialización del signal */
  private getRolesFromStorage(): string[] {
    try {
      return JSON.parse(localStorage.getItem(this.ROLES_KEY) ?? '[]');
    } catch { return []; }
  }
}