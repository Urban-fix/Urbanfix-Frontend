import React from 'react';
import { Link } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="auth-page min-h-screen bg-bg">
      {/* Desktop: Split layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:min-h-screen">
        <div className="lg:col-span-7 flex flex-col">
          <div className="p-6 border-b border-line">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-text-muted hover:text-accent transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <Effect
              fade
              slide={{ direction: 'up', offset: 18 }}
              className="auth-card w-full max-w-md"
            >
              <h1 className="font-heading font-bold text-4xl uppercase tracking-tight text-text mb-2">
                {title}
              </h1>
              {subtitle && <p className="text-text-muted mb-8">{subtitle}</p>}
              {children}
            </Effect>
          </div>
        </div>

        <div className="lg:col-span-5 auth-visual flex items-center justify-center p-12">
          <div className="text-center max-w-sm">
            <p className="auth-visual-kicker">UrbanFix</p>
            <h2 className="font-heading font-bold uppercase tracking-tight text-[#1E1E1E] mb-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95]">
              TU CIUDAD
              <br />
              REPORTADA
            </h2>
            <p className="text-[#4A4A46] text-lg leading-relaxed">
              Reporta problemas urbanos y mejora tu comunidad
            </p>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <div className="p-4 border-b border-line">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-text-muted hover:text-accent transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <Effect
            fade
            slide={{ direction: 'up', offset: 16 }}
            className="auth-card w-full max-w-md"
          >
            <h1 className="font-heading font-bold text-3xl uppercase tracking-tight text-text mb-2">
              {title}
            </h1>
            {subtitle && <p className="text-text-muted mb-8">{subtitle}</p>}
            {children}
          </Effect>
        </div>
      </div>
    </div>
  );
};
