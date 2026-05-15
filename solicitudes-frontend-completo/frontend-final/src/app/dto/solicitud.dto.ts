export type EstadoSolicitud =
  | 'REGISTRADA' | 'CLASIFICADA' | 'EN_ATENCION' | 'ATENDIDA' | 'CERRADA';

export type CanalOrigen =
  |'PRESENCIAL' | 'CORREO_ELECTRONICO' | 'TELEFONICO' | 'SAC' | 'CSU';

export type TipoSolicitud =
  | 'HOMOLOGACION' | 'REGISTRO_ASIGNATURA' | 'CANCELACION_ASIGNATURA'
  | 'SOLICITUD_CUPO' | 'CONSULTA_ACADEMICA' | 'OTRO';

export type NivelPrioridad = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';

// ── Responses ────────────────────────────────────────────────────────────────

export interface SolicitudResumenResponse {
  id: string;
  descripcionBreve: string;
  estado: EstadoSolicitud;
  tipo: TipoSolicitud | null;
  nivelPrioridad: NivelPrioridad | null;
  solicitanteNombre: string | null;
  responsableNombre: string | null;
  fechaRegistro: string;
}

export interface SolicitudDetalleResponse {
  id: string;
  descripcion: string;
  canalOrigen: CanalOrigen;
  estado: EstadoSolicitud;
  tipo: TipoSolicitud | null;
  nivelPrioridad: NivelPrioridad | null;
  justificacionPrioridad: string | null;
  solicitanteId: string;
  solicitanteNombre: string | null;
  responsableId: string | null;
  responsableNombre: string | null;
  fechaRegistro: string;
  totalEntradaHistorial: number;
}

export interface EventoHistorialResponse {
  descripcion: string;
  fecha: string;
  usuario: string;
}

// ── Requests básicos ──────────────────────────────────────────────────────────

export interface CrearSolicitudRequest {
  descripcion: string;
  canalOrigen: CanalOrigen;
  solicitanteId: string;
}

// ── Requests acciones avanzadas ───────────────────────────────────────────────

export interface ClasificarSolicitudRequest {
  tipo: TipoSolicitud;
  nivelPrioridad: NivelPrioridad;
  justificacionPrioridad: string;
  coordinadorId: string;
}

export interface AsignarResponsableRequest {
  responsableId: string;
  coordinadorId: string;
}

export interface IniciarAtencionRequest {
  coordinadorId: string;
}

export interface AtenderSolicitudRequest {
  observacion: string;
  responsableId: string;
}

export interface CerrarSolicitudRequest {
  observacion: string;
  coordinadorId: string;
}
