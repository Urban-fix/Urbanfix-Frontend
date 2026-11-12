import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { ZonaResponseDTO, ZonaCreateDTO, ZonaUpdateDTO } from '../types/zona.types';

export const useZonas = () => {
  const [zonas, setZonas] = useState<ZonaResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchZonas();
  }, []);

  const fetchZonas = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ZonaResponseDTO[]>('/api/v1/zonas');
      setZonas(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar zonas');
    } finally {
      setIsLoading(false);
    }
  };

  const createZona = async (data: ZonaCreateDTO) => {
    try {
      const response = await api.post<ZonaResponseDTO>('/api/v1/zonas', data);
      setZonas([...zonas, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al crear zona');
    }
  };

  const updateZona = async (id: number, data: ZonaUpdateDTO) => {
    try {
      const response = await api.put<ZonaResponseDTO>(`/api/v1/zonas/${id}`, data);
      setZonas(zonas.map(z => z.id === id ? response.data : z));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al actualizar zona');
    }
  };

  const deleteZona = async (id: number) => {
    try {
      await api.delete(`/api/v1/zonas/${id}`);
      setZonas(zonas.filter(z => z.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al eliminar zona');
    }
  };

  return { zonas, isLoading, error, createZona, updateZona, deleteZona, refetch: fetchZonas };
};
