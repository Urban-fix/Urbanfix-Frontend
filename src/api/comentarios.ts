import { api } from './axios';

export const comentariosApi = {
  getComentarios: (reporteId: number) => 
    api.get(`/api/v1/reportes/${reporteId}/comentarios`),
  
  createComentario: (reporteId: number, data: any) => 
    api.post(`/api/v1/reportes/${reporteId}/comentarios`, data),
  
  deleteComentario: (reporteId: number, comentarioId: number) => 
    api.delete(`/api/v1/reportes/${reporteId}/comentarios/${comentarioId}`),
};
