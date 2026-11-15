import React from 'react';
import { ReporteCard } from './ReporteCard';
import type { ReporteResponseDTO, ReportePublicDTO } from '../../types/reporte.types';
import { Spinner } from '../ui/Spinner';

interface ReporteListProps {
  reportes: ReporteResponseDTO[] | ReportePublicDTO[];
  isLoading: boolean;
  error: string | null;
}

export const ReporteList: React.FC<ReporteListProps> = ({
  reportes,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded border border-error/30 bg-error/10 py-8 text-center text-sm text-error">
        <p>{error}</p>
      </div>
    );
  }

  if (reportes.length === 0) {
    return (
      <div className="auth-empty-card py-12 text-center">
        <p className="font-heading text-lg uppercase text-text">Sin reportes</p>
        <p className="mt-2 text-sm text-text-secondary">
          No hay reportes para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reportes.map((reporte) => (
        <ReporteCard key={reporte.id} reporte={reporte} />
      ))}
    </div>
  );
};
