import { useState, useEffect } from 'react';
import { reportesApi } from '../api/reportes';
import type { ReportePublicDTO, ReportFilters } from '../types/reporte.types';

export const useReportesPublic = (filters?: ReportFilters) => {
  const [reportes, setReportes] = useState<ReportePublicDTO[]>([]);
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

      const response = await reportesApi.getReportesPublic(params);
      setReportes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reportes públicos');
    } finally {
      setIsLoading(false);
    }
  };

  const getReportePublic = async (id: number) => {
    try {
      const response = await reportesApi.getReportePublic(id);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al cargar reporte');
    }
  };

  return { reportes, isLoading, error, getReportePublic, refetch: fetchReportes };
};
