import { api } from './axios';

export const zonasApi = {
  getZonas: () => 
    api.get('/zonas'),
  
  getZona: (id: number) => 
    api.get(`/zonas/${id}`),
  
  createZona: (data: any) => 
    api.post('/zonas', data),
  
  updateZona: (id: number, data: any) => 
    api.put(`/zonas/${id}`, data),
  
  deleteZona: (id: number) => 
    api.delete(`/zonas/${id}`),
};
