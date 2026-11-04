import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import type { ReporteResponseDTO } from '../../types/reporte.types';
import { formatRelativeTime } from '../../utils/formatters';
import { ESTADOS_REPORTE } from '../../utils/constants';
import { ThumbsUp, MapPin } from 'lucide-react';

interface ReporteCardProps {
  reporte: ReporteResponseDTO;
}

export const ReporteCard: React.FC<ReporteCardProps> = ({ reporte }) => {
  return (
    <Link to={`/reportes/${reporte.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-2">
            {reporte.titulo}
          </h3>
          <StatusBadge estado={reporte.estadoActual as keyof typeof ESTADOS_REPORTE} />
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {reporte.descripcion}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{reporte.zona.nombre}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{reporte.confirmacionesCount}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(reporte.fechaCreacion)}
          </p>
        </div>
      </Card>
    </Link>
  );
};
