import React from 'react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import type { ComentarioResponseDTO } from '../../types/reporte.types';
import { formatDateTime } from '../../utils/formatters';

interface CommentItemProps {
  comentario: ComentarioResponseDTO;
  index?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comentario,
  index = 0,
}) => {
  const initials =
    comentario.usuario.nombre
      ?.split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <Effect
      fade
      slide={{ direction: 'up', offset: 10 }}
      delay={0.04 * index}
      inView
    >
      <article className="auth-comment">
        <div className="auth-avatar auth-avatar-sm shrink-0" aria-hidden>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-text">
              {comentario.usuario.nombre}
            </p>
            <time className="text-xs text-text-muted">
              {formatDateTime(comentario.fechaCreacion)}
            </time>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            {comentario.contenido}
          </p>
        </div>
      </article>
    </Effect>
  );
};
