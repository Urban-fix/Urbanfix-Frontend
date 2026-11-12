import React from 'react';
import { Link } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { StatusBadge } from '../ui/StatusBadge';
import type {
  ReporteResponseDTO,
  ReportePublicDTO,
} from '../../types/reporte.types';
import { formatRelativeTime } from '../../utils/formatters';
import { ESTADOS_REPORTE } from '../../utils/constants';
import { homeImages } from '../../utils/homeMedia';
import { ThumbsUp, MapPin } from 'lucide-react';

interface ReporteCardProps {
  reporte: ReporteResponseDTO | ReportePublicDTO;
}

export const ReporteCard: React.FC<ReporteCardProps> = ({ reporte }) => {
  const zonaNombre =
    'zona' in reporte && reporte.zona
      ? reporte.zona.nombre
      : 'zonaNombre' in reporte
        ? (reporte as { zonaNombre?: string }).zonaNombre
        : undefined;

  const confirmaciones =
    'confirmacionesCount' in reporte ? reporte.confirmacionesCount : undefined;

  return (
    <Effect fade slide={{ direction: 'up', offset: 12 }} inView>
      <Link to={`/reportes/${reporte.id}`} className="block h-full">
        <article className="auth-report-card h-full">
          <div className="auth-report-media">
            <img
              src={reporte.fotoUrl || homeImages.baches}
              alt={reporte.titulo}
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-heading uppercase text-text text-base leading-tight line-clamp-2">
                {reporte.titulo}
              </h3>
              <StatusBadge
                estado={reporte.estadoActual as keyof typeof ESTADOS_REPORTE}
                showIcon={false}
              />
            </div>
            <p className="text-sm text-text-muted line-clamp-2 mb-3">
              {reporte.descripcion}
            </p>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-accent" />
                <span className="truncate">{zonaNombre || 'Sin zona'}</span>
              </div>
              {typeof confirmaciones === 'number' && (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{confirmaciones}</span>
                </div>
              )}
            </div>
            <p className="mt-3 pt-3 border-t border-line text-xs text-text-muted">
              {formatRelativeTime(reporte.fechaCreacion)}
            </p>
          </div>
        </article>
      </Link>
    </Effect>
  );
};
