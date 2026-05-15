export type TipoUsuario = 'ESTUDIANTE' | 'DOCENTE' | 'COORDINADOR' | 'ADMINISTRATIVO';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface UsuarioResumenResponse {
  id: string;
  identificacion: string;
  nombre: string;
  email: string;
  tipoUsuario: TipoUsuario;
  estadoUsuario: EstadoUsuario;
}

export interface UsuarioDetalleResponse {
  id: string;
  identificacion: string;
  nombre: string;
  email: string;
  tipoUsuario: TipoUsuario;
  estadoUsuario: EstadoUsuario;
}

export interface CrearUsuarioRequest {
  identificacion: string;
  nombre: string;
  email: string;
  tipoUsuario: TipoUsuario;
}

export interface CambiarPasswordRequest {
  passwordActual: string;
  passwordNueva: string;
}
