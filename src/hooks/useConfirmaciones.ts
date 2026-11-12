import { useState, useEffect } from 'react';
import { confirmacionesApi } from '../api/confirmaciones';
import type { UsuarioResponseDTO } from '../types/auth.types';

export const useConfirmaciones = (reporteId: number) => {
  const [confirmaciones, setConfirmaciones] = useState<UsuarioResponseDTO[]>([]);
  const [conteo, setConteo] = useState(0);
  const [isConfirmedByMe, setIsConfirmedByMe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfirmaciones();
    verificarMiConfirmacion();
  }, [reporteId]);

  const fetchConfirmaciones = async () => {
    try {
      setIsLoading(true);
      const response = await confirmacionesApi.getConfirmaciones(reporteId);
      setConfirmaciones(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar confirmaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const verificarMiConfirmacion = async () => {
    try {
      const response = await confirmacionesApi.verificarConfirmacion(reporteId);
      setIsConfirmedByMe(response.data);
    } catch (err: any) {
      // Si no está autenticado, simplemente no está confirmado
      setIsConfirmedByMe(false);
    }
  };

  const confirmar = async () => {
    try {
      await confirmacionesApi.confirmarReporte(reporteId);
      setIsConfirmedByMe(true);
      setConteo(conteo + 1);
      await fetchConfirmaciones();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al confirmar reporte');
    }
  };

  const retirar = async () => {
    try {
      await confirmacionesApi.retirarConfirmacion(reporteId);
      setIsConfirmedByMe(false);
      setConteo(Math.max(0, conteo - 1));
      await fetchConfirmaciones();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al retirar confirmación');
    }
  };

  return {
    confirmaciones,
    conteo,
    isConfirmedByMe,
    isLoading,
    error,
    confirmar,
    retirar,
    refetch: fetchConfirmaciones,
  };
};
