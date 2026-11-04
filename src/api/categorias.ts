import { api } from './axios';

export const categoriasApi = {
  getCategorias: () => 
    api.get('/categorias'),
  
  getCategoria: (id: number) => 
    api.get(`/categorias/${id}`),
  
  createCategoria: (data: any) => 
    api.post('/categorias', data),
  
  updateCategoria: (id: number, data: any) => 
    api.put(`/categorias/${id}`, data),
  
  deleteCategoria: (id: number) => 
    api.delete(`/categorias/${id}`),
};
