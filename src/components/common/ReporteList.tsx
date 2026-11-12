import React from 'react';
import { ReporteCard } from './ReporteCard';
import type { ReporteResponseDTO, ReportePublicDTO } from '../../types/reporte.types';
import { Spinner } from '../ui/Spinner';

interface ReporteListProps {
  reportes: ReporteResponseDTO[] | ReportePublicDTO[];
  isLoading: boolean;
  error: string | null;
}

export const ReporteList: React.FC<ReporteListProps> = ({ reportes, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (reportes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay reportes para mostrar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reportes.map((reporte) => (
        <ReporteCard key={reporte.id} reporte={reporte} />
      ))}
    </div>
  );
};
