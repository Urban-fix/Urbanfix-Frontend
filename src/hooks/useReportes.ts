import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { ReporteResponseDTO, ReporteCreateDTO, ReporteUpdateDTO, ReportFilters } from '../types/reporte.types';

export const useReportes = (filters?: ReportFilters) => {
  const [reportes, setReportes] = useState<ReporteResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportes();
  }, [filters]);

  const fetchReportes = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters?.estado) params.append('estado', filters.estado);
      if (filters?.categoriaId) params.append('categoriaId', filters.categoriaId.toString());
      if (filters?.zonaId) params.append('zonaId', filters.zonaId.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get<ReporteResponseDTO[]>(`/reportes?${params}`);
      setReportes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const createReporte = async (data: ReporteCreateDTO) => {
    try {
      const response = await api.post<ReporteResponseDTO>('/reportes', data);
      setReportes([...reportes, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al crear reporte');
    }
  };

  const updateReporte = async (id: number, data: ReporteUpdateDTO) => {
    try {
      const response = await api.put<ReporteResponseDTO>(`/reportes/${id}`, data);
      setReportes(reportes.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al actualizar reporte');
    }
  };

  const deleteReporte = async (id: number) => {
    try {
      await api.delete(`/reportes/${id}`);
      setReportes(reportes.filter(r => r.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al eliminar reporte');
    }
  };

  return { reportes, isLoading, error, createReporte, updateReporte, deleteReporte, refetch: fetchReportes };
};
