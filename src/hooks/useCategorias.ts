import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { CategoriaResponseDTO, CategoriaCreateDTO, CategoriaUpdateDTO } from '../types/categoria.types';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<CategoriaResponseDTO[]>('/categorias');
      setCategorias(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  const createCategoria = async (data: CategoriaCreateDTO) => {
    try {
      const response = await api.post<CategoriaResponseDTO>('/categorias', data);
      setCategorias([...categorias, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al crear categoría');
    }
  };

  const updateCategoria = async (id: number, data: CategoriaUpdateDTO) => {
    try {
      const response = await api.put<CategoriaResponseDTO>(`/categorias/${id}`, data);
      setCategorias(categorias.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al actualizar categoría');
    }
  };

  const deleteCategoria = async (id: number) => {
    try {
      await api.delete(`/categorias/${id}`);
      setCategorias(categorias.filter(c => c.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al eliminar categoría');
    }
  };

  return { categorias, isLoading, error, createCategoria, updateCategoria, deleteCategoria, refetch: fetchCategorias };
};
