import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ 
  children, 
  active = false, 
  count, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded font-medium text-sm transition-all duration-200
        ${active 
          ? 'bg-accent text-accent-ink' 
          : 'bg-surface text-text-muted hover:text-text'
        }
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${className}
      `}
      aria-pressed={active}
    >
      {children}
      {count !== undefined && (
        <span className="ml-2 opacity-70">
          ({count})
        </span>
      )}
    </button>
  );
};
