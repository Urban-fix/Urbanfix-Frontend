import React from 'react';
import { ESTADO_COLORS, ESTADO_ICONS } from '../../utils/constants';
import * as Icons from 'lucide-react';

interface StatusBadgeProps {
  estado: keyof typeof ESTADO_COLORS;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ estado, showIcon = true }) => {
  const IconComponent = Icons[ESTADO_ICONS[estado] as keyof typeof Icons] as React.ElementType;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${ESTADO_COLORS[estado]}`}>
      {showIcon && IconComponent && <IconComponent className="w-3.5 h-3.5" />}
      <span className="uppercase tracking-wider">{estado.replace('_', ' ')}</span>
    </span>
  );
};
