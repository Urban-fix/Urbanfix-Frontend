import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import type { ReporteResponseDTO } from '../../types/reporte.types';
import { ESTADO_COLORS } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';
import { ThumbsUp, MapPin } from 'lucide-react';

interface ReporteCardProps {
  reporte: ReporteResponseDTO;
}

export const ReporteCard: React.FC<ReporteCardProps> = ({ reporte }) => {
  return (
    <Link to={`/reportes/${reporte.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {reporte.titulo}
          </h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[reporte.estadoActual]}`}>
            {reporte.estadoActual.replace('_', ' ')}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
          {reporte.descripcion}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{reporte.zona.nombre}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{reporte.confirmacionesCount}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            {formatRelativeTime(reporte.fechaCreacion)}
          </p>
        </div>
      </Card>
    </Link>
  );
};
