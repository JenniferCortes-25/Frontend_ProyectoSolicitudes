// Enums — deben coincidir exactamente con los enums Java del backend
export type EstadoSolicitud =
  'REGISTRADA' | 'CLASIFICADA' | 'EN_ATENCION' | 'ATENDIDA' | 'CERRADA';

export type CanalOrigen =
  'PRESENCIAL' | 'CORREO_ELECTRONICO' | 'TELEFONICO' | 'SAC' | 'CSU';

export type TipoSolicitud =
  'HOMOLOGACION' | 'REGISTRO_ASIGNATURA' | 'CANCELACION_ASIGNATURA'
  | 'SOLICITUD_CUPO' | 'CONSULTA_ACADEMICA' | 'OTRO';

export type NivelPrioridad = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';

// Espejo de SolicitudResumenResponse del backend
export interface SolicitudResumen {
  id: string;
  descripcionBreve: string;
  estado: EstadoSolicitud;
  tipo: TipoSolicitud | null;
  nivelPrioridad: NivelPrioridad | null;
  solicitanteNombre: string | null;
  responsableNombre: string | null;
  fechaRegistro: string;
}

// Espejo de CrearSolicitudRequest del backend
export interface CrearSolicitudRequest {
  descripcion: string;
  canalOrigen: CanalOrigen;
  solicitanteId: string;
}