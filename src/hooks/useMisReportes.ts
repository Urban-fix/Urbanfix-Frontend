import { useState, useEffect } from 'react';
import { reportesApi } from '../api/reportes';
import type { ReporteResponseDTO } from '../types/reporte.types';

export const useMisReportes = () => {
  const [reportes, setReportes] = useState<ReporteResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMisReportes = async () => {
    try {
      setIsLoading(true);
      const response = await reportesApi.getMisReportes();
      setReportes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar mis reportes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMisReportes();
  }, []);

  const deleteReporte = async (id: number) => {
    try {
      await reportesApi.deleteReporte(id);
      setReportes(reportes.filter(r => r.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al eliminar reporte');
    }
  };

  return { reportes, isLoading, error, deleteReporte, refetch: fetchMisReportes };
};
