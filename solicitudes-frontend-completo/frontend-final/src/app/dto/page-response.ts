/**
 * Interfaz genérica para respuestas paginadas del backend.
 * Equivale a org.springframework.data.domain.Page<T> de Spring Boot.
 *
 * @template T - Tipo del elemento en el listado (ej: SolicitudResumenResponse)
 */
export interface PageResponse<T> {
  content: T[];           // elementos de la página actual
  totalElements: number;  // total de registros en la BD
  totalPages: number;     // total de páginas
  size: number;           // tamaño de página
  number: number;         // índice de página actual (0-indexed)
}