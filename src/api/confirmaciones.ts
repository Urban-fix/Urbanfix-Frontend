import { api } from './axios';

export const confirmacionesApi = {
  // Endpoints públicos
  getConfirmaciones: (reporteId: number) => 
    api.get(`/api/v1/reportes/${reporteId}/confirmaciones`),
  
  getConteoConfirmaciones: (reporteId: number) => 
    api.get(`/api/v1/reportes/${reporteId}/confirmaciones/conteo`),
  
  // Endpoints autenticados
  confirmarReporte: (reporteId: number) => 
    api.post(`/api/v1/reportes/${reporteId}/confirmaciones`),
  
  retirarConfirmacion: (reporteId: number) => 
    api.delete(`/api/v1/reportes/${reporteId}/confirmaciones`),
  
  verificarConfirmacion: (reporteId: number) => 
    api.get(`/api/v1/reportes/${reporteId}/confirmaciones/verificar`),
};
