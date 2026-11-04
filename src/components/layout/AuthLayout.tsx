import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop: Split layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:min-h-screen">
        {/* Left: Form (55%) */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Header with logo and back link */}
          <div className="p-6 border-b border-line">
            <Link to="/" className="inline-flex items-center text-sm text-text-muted hover:text-text transition-colors">
              ← Volver al inicio
            </Link>
          </div>
          
          {/* Form content */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <h1 className="font-heading font-bold text-4xl uppercase tracking-tight text-text mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-text-muted mb-8">{subtitle}</p>
              )}
              {children}
            </div>
          </div>
        </div>
        
        {/* Right: Visual block (45%) */}
        <div className="lg:col-span-5 bg-panel-light flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="font-heading font-bold text-5xl uppercase tracking-tight text-accent-ink mb-4" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
              TU CIUDAD<br />
              REPORTADA
            </h2>
            <p className="text-text-muted text-lg">
              Reporta problemas urbanos y mejora tu comunidad
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile: Form only */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Header with logo and back link */}
        <div className="p-4 border-b border-line">
          <Link to="/" className="inline-flex items-center text-sm text-text-muted hover:text-text transition-colors">
            ← Volver al inicio
          </Link>
        </div>
        
        {/* Form content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <h1 className="font-heading font-bold text-3xl uppercase tracking-tight text-text mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-text-muted mb-8">{subtitle}</p>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
