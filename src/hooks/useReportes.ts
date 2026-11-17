import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import type { ReporteResponseDTO, ReporteCreateDTO, ReporteUpdateDTO, ReportFilters } from '../types/reporte.types';

export const useReportes = (filters?: ReportFilters) => {
  const [reportes, setReportes] = useState<ReporteResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportes();
  }, [filters?.estado, filters?.categoriaId, filters?.zonaId, filters?.search, filters?.usuarioId]);

  const fetchReportes = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters?.estado) params.append('estado', filters.estado);
      if (filters?.categoriaId) params.append('categoriaId', filters.categoriaId.toString());
      if (filters?.zonaId) params.append('zonaId', filters.zonaId.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.usuarioId) params.append('usuarioId', filters.usuarioId.toString());

      const response = await api.get<ReporteResponseDTO[]>(`/api/v1/reportes?${params}`);
      setReportes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const createReporte = async (data: ReporteCreateDTO | FormData) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await api.post<ReporteResponseDTO>('/api/v1/reportes', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      setReportes([...reportes, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al crear reporte');
    }
  };

  const updateReporte = async (id: number, data: ReporteUpdateDTO) => {
    try {
      const response = await api.put<ReporteResponseDTO>(`/api/v1/reportes/${id}`, data);
      setReportes(reportes.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al actualizar reporte');
    }
  };

  const deleteReporte = async (id: number) => {
    try {
      await api.delete(`/api/v1/reportes/${id}`);
      setReportes(reportes.filter(r => r.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al eliminar reporte');
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      console.log('[REPORTES] Cambiando estado del reporte', id, 'a:', nuevoEstado);
      console.log('[REPORTES] Payload enviado:', nuevoEstado);
      console.log('[REPORTES] Content-Type: application/json');
      
      const response = await api.patch(`/api/v1/reportes/${id}/estado`, nuevoEstado, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('[REPORTES] Respuesta exitosa:', response.status);
      
      // Actualizar estado localmente
      setReportes(reportes.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
    } catch (error: any) {
      console.error('[REPORTES] Error al cambiar estado:', error.response?.status, error.response?.data);
      throw error;
    }
  };

  return { reportes, isLoading, error, createReporte, updateReporte, deleteReporte, cambiarEstado, refetch: fetchReportes };
};
