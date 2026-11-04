import React from 'react';
import type { ComentarioResponseDTO } from '../../types/reporte.types';
import { formatDateTime } from '../../utils/formatters';
import { User } from 'lucide-react';

interface CommentItemProps {
  comentario: ComentarioResponseDTO;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comentario }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {comentario.usuario.nombre}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDateTime(comentario.fechaCreacion)}
            </p>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {comentario.contenido}
          </p>
        </div>
      </div>
    </div>
  );
};
