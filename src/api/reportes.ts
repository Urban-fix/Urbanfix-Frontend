import { api } from './axios';

export const reportesApi = {
  getReportes: (params?: any) => 
    api.get('/reportes', { params }),
  
  getReporte: (id: number) => 
    api.get(`/reportes/${id}`),
  
  getReporteDetalle: (id: number) => 
    api.get(`/reportes/${id}/detalle`),
  
  getMisReportes: () => 
    api.get('/reportes/mis-reportes'),
  
  createReporte: (data: any) => 
    api.post('/reportes', data),
  
  updateReporte: (id: number, data: any) => 
    api.put(`/reportes/${id}`, data),
  
  deleteReporte: (id: number) => 
    api.delete(`/reportes/${id}`),
  
  cambiarEstado: (id: number, estado: string) => 
    api.patch(`/reportes/${id}/estado`, { estado }),
};
