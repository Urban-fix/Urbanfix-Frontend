import { api } from './axios';

export const reportesApi = {
  // Endpoints públicos (sin autenticación)
  getReportesPublic: (params?: any) => 
    api.get('/api/v1/reportes/public', { params }),
  
  getReportePublic: (id: number) => 
    api.get(`/api/v1/reportes/public/${id}`),
  
  // Endpoints autenticados
  getReportes: (params?: any) => 
    api.get('/api/v1/reportes', { params }),
  
  getReporte: (id: number) => 
    api.get(`/api/v1/reportes/${id}`),
  
  getReporteDetalle: (id: number) => 
    api.get(`/api/v1/reportes/${id}/detalle`),
  
  getMisReportes: () => 
    api.get('/api/v1/reportes/mis-reportes'),
  
  createReporte: (data: any) => 
    api.post('/api/v1/reportes', data),
  
  updateReporte: (id: number, data: any) => 
    api.put(`/api/v1/reportes/${id}`, data),
  
  deleteReporte: (id: number) => 
    api.delete(`/api/v1/reportes/${id}`),
  
  cambiarEstado: (id: number, estado: string) => 
    api.patch(`/api/v1/reportes/${id}/estado`, { estado }),
};
