import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-line bg-surface py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link to="/" className="font-heading text-xl font-bold uppercase tracking-tight text-text mb-4 block">
              UrbanFix
            </Link>
            <p className="text-sm text-text-muted">
              Reporta problemas urbanos y mejora tu comunidad.
            </p>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-tight text-text mb-4">
              Producto
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/reportes" className="text-sm text-text-muted hover:text-text transition-colors">
                  Reportes
                </Link>
              </li>
              <li>
                <Link to="/mapa" className="text-sm text-text-muted hover:text-text transition-colors">
                  Mapa
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-text-muted hover:text-text transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-tight text-text mb-4">
              Ayuda
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ayuda" className="text-sm text-text-muted hover:text-text transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-sm text-text-muted hover:text-text transition-colors">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-sm text-text-muted hover:text-text transition-colors">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-tight text-text mb-4">
              Contacto
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contacto@urbanfix.com" className="text-sm text-text-muted hover:text-text transition-colors">
                  contacto@urbanfix.com
                </a>
              </li>
              <li>
                <a href="https://twitter.com/urbanfix" className="text-sm text-text-muted hover:text-text transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/urbanfix" className="text-sm text-text-muted hover:text-text transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-line pt-8">
          <p className="text-sm text-text-muted text-center">
            © {new Date().getFullYear()} UrbanFix. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
