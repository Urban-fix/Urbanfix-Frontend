import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

interface Requirement {
  label: string;
  check: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: 'Mínimo 8 caracteres', check: (p) => p.length >= 8 },
  { label: 'Al menos una mayúscula', check: (p) => /[A-Z]/.test(p) },
  { label: 'Al menos una minúscula', check: (p) => /[a-z]/.test(p) },
  { label: 'Al menos un número', check: (p) => /\d/.test(p) },
];

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  return (
    <div className="mt-3 space-y-2">
      {requirements.map((req, index) => {
        const isMet = req.check(password);
        return (
          <div key={index} className="flex items-center gap-2 text-xs">
            {isMet ? (
              <Check className="h-3.5 w-3.5 text-accent" />
            ) : (
              <X className="h-3.5 w-3.5 text-text-muted" />
            )}
            <span className={isMet ? 'text-text' : 'text-text-muted'}>
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
