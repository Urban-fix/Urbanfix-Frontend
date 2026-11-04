import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, type = 'text', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={`w-full h-12 px-4 border border-line bg-surface text-text rounded placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
              isPassword ? 'pr-12' : ''
            } ${error ? 'border-error' : ''} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-text-muted hover:text-accent transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-error flex items-center gap-1">
            <span className="text-xs">⚠</span>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
