import React from 'react';
import { Link } from 'react-router-dom';

const COPYRIGHT_YEAR = 2026;

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-line bg-surface py-12">
      <div className="container">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link
              to="/"
              className="mb-4 block font-heading text-xl font-bold uppercase tracking-tight text-text"
            >
              Urban<span className="text-accent">Fix</span>
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">
              Reporta problemas urbanos y mejora tu comunidad.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-tight text-text">
              Explorar
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/mapa"
                  className="text-sm text-text-secondary transition-colors duration-200 hover:text-text"
                >
                  Mapa
                </Link>
              </li>
              <li>
                <Link
                  to="/informes"
                  className="text-sm text-text-secondary transition-colors duration-200 hover:text-text"
                >
                  Informes
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-text-secondary transition-colors duration-200 hover:text-text"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-tight text-text">
              Cuenta
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-sm text-text-secondary transition-colors duration-200 hover:text-text"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-text-secondary transition-colors duration-200 hover:text-text"
                >
                  Registrarse
                </Link>
              </li>
              <li>
                <Link
                  to="/perfil"
                  className="text-sm text-text-secondary transition-colors duration-200 hover:text-text"
                >
                  Perfil
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line pt-8">
          <p className="text-center text-sm text-text-muted">
            © {COPYRIGHT_YEAR} UrbanFix. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
