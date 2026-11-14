import { api } from './client';
import type { AuthResponseDTO, RegisterRequestDTO, UsuarioResponseDTO } from '../types/auth.types';
import type {
  ReporteCreateDTO,
  ReporteDetailDTO,
  ReportePublicDTO,
  ReporteResponseDTO,
  ReporteUpdateDTO,
  ReportFilters,
} from '../types/reporte.types';
import type { CategoriaResponseDTO } from '../types/categoria.types';
import type { ZonaResponseDTO } from '../types/zona.types';

const clean = (f?: ReportFilters) =>
  Object.fromEntries(Object.entries(f ?? {}).filter(([, v]) => v !== '' && v !== undefined && v !== null));

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponseDTO>('/api/v1/auth/login', { email, password }),
  register: (data: RegisterRequestDTO) => api.post<AuthResponseDTO>('/api/v1/auth/register', data),
  me: () => api.get<UsuarioResponseDTO>('/api/v1/auth/me'),
  logout: () => api.post('/api/v1/auth/logout'),
  requestPasswordReset: (email: string) => api.post('/api/v1/auth/password-reset/request', { email }),
  confirmPasswordReset: (code: string, newPassword: string) =>
    api.post('/api/v1/auth/password-reset/confirm', { code, newPassword }),
};

export const reportesApi = {
  getPublic: (filters?: ReportFilters) =>
    api.get<ReportePublicDTO[]>('/api/v1/reportes/public', { params: clean(filters) }),
  getAll: (filters?: ReportFilters) =>
    api.get<ReporteResponseDTO[]>('/api/v1/reportes', { params: clean(filters) }),
  getDetalle: (id: number) => api.get<ReporteDetailDTO>(`/api/v1/reportes/${id}/detalle`),
  getMis: () => api.get<ReporteResponseDTO[]>('/api/v1/reportes/mis-reportes'),
  create: (data: ReporteCreateDTO) => api.post<ReporteResponseDTO>('/api/v1/reportes', data),
  createWithPhoto: (form: FormData) =>
    api.post<ReporteResponseDTO>('/api/v1/reportes', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: (d) => d, // que axios no intente serializar el FormData
    }),
  update: (id: number, data: ReporteUpdateDTO) => api.put<ReporteResponseDTO>(`/api/v1/reportes/${id}`, data),
  remove: (id: number) => api.delete(`/api/v1/reportes/${id}`),
  cambiarEstado: (id: number, estado: string) => api.patch(`/api/v1/reportes/${id}/estado`, { estado }),
};

export const comentariosApi = {
  create: (reporteId: number, contenido: string) =>
    api.post(`/api/v1/reportes/${reporteId}/comentarios`, { contenido }),
};

export const confirmacionesApi = {
  confirmar: (reporteId: number) => api.post(`/api/v1/reportes/${reporteId}/confirmaciones`),
  retirar: (reporteId: number) => api.delete(`/api/v1/reportes/${reporteId}/confirmaciones`),
};

// El backend expone estos recursos bajo /api/v1 (CategoriaController / ZonaController).
export const catalogosApi = {
  categorias: () => api.get<CategoriaResponseDTO[]>('/api/v1/categorias'),
  zonas: () => api.get<ZonaResponseDTO[]>('/api/v1/zonas'),
};
