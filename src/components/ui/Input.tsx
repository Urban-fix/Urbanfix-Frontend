import React, { useState, useId, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onAutoComplete?: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, type = 'text', name, onAutoComplete, ...props }, ref) => {
    const uniqueId = useId();
    const inputId = id || uniqueId;
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Detectar autocompletado de Chrome
    useEffect(() => {
      const input = inputRef.current;
      if (!input || !onAutoComplete) return;

      const handleAutoComplete = () => {
        // Chrome no dispara eventos onChange al autocompletar, pero sí dispara 'change'
        // cuando el usuario interactúa con el campo o al perder el foco
        if (input.value) {
          console.log('[INPUT] autocompletado detectado para:', name, 'valor presente:', !!input.value);
          onAutoComplete(input.value);
        }
      };

      // Escuchar evento 'change' que Chrome dispara al autocompletar
      input.addEventListener('change', handleAutoComplete);

      return () => {
        input.removeEventListener('change', handleAutoComplete);
      };
    }, [onAutoComplete, name]);

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
            ref={(node) => {
              // Asignar ref a ambos: el ref externo y el ref interno
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              inputRef.current = node;
            }}
            id={inputId}
            name={name}
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
