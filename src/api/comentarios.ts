import { api } from './axios';

export const comentariosApi = {
  getComentarios: (reporteId: number) => 
    api.get(`/reportes/${reporteId}/comentarios`),
  
  createComentario: (reporteId: number, data: any) => 
    api.post(`/reportes/${reporteId}/comentarios`, data),
  
  deleteComentario: (reporteId: number, comentarioId: number) => 
    api.delete(`/reportes/${reporteId}/comentarios/${comentarioId}`),
};
