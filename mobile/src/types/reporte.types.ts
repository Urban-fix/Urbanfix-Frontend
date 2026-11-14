export type EstadoReporte = 'PENDIENTE' | 'EN_PROGRESO' | 'RESUELTO' | 'RECHAZADO';

export interface ReporteCreateDTO {
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  fotoUrl?: string;
  categoriaId: number;
  zonaId: number;
}

export interface ReporteUpdateDTO {
  titulo?: string;
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  fotoUrl?: string;
  categoriaId?: number;
  zonaId?: number;
}

export interface UsuarioResponseDTO {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface CategoriaResponseDTO {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ZonaResponseDTO {
  id: number;
  nombre: string;
  coordenadasReferencia: string;
}

export interface EstadoHistorialResponseDTO {
  id: number;
  estado: string;
  fechaCambio: string;
  usuario: UsuarioResponseDTO;
}

export interface ComentarioResponseDTO {
  id: number;
  contenido: string;
  fechaCreacion: string;
  usuario: UsuarioResponseDTO;
}

export interface ReporteResponseDTO {
  id: number;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  fotoUrl: string;
  fechaCreacion: string;
  estadoActual: EstadoReporte;
  usuario: UsuarioResponseDTO;
  categoria: CategoriaResponseDTO;
  zona: ZonaResponseDTO;
  confirmacionesCount: number;
}

// DTO público sin datos de usuario (para Home/Mapa)
export interface ReportePublicDTO {
  id: number;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  fotoUrl?: string; // Puede ser null o undefined si no hay foto
  fechaCreacion: string;
  estadoActual: EstadoReporte;
  categoria: CategoriaResponseDTO;
  zona: ZonaResponseDTO;
  confirmacionesCount: number;
}

export interface ReporteDetailDTO extends ReporteResponseDTO {
  historialEstados: EstadoHistorialResponseDTO[];
  comentarios: ComentarioResponseDTO[];
  confirmaciones: UsuarioResponseDTO[];
}

export interface ReportFilters {
  estado?: string;
  categoriaId?: number;
  zonaId?: number;
  usuarioId?: number;
  search?: string;
}
