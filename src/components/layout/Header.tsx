import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, FileText, Map, LayoutDashboard, UserCircle, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/reportes', label: 'Reportes', icon: FileText },
    { path: '/mapa', label: 'Mapa', icon: Map },
  ];

  const authNavItems = [
    { path: '/dashboard', label: 'Mis Reportes', icon: LayoutDashboard },
    { path: '/perfil', label: 'Perfil', icon: UserCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-line bg-bg max-h-20">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="font-heading text-2xl font-bold uppercase tracking-tight text-text">
              UrbanFix
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-accent text-accent-ink'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-surface-2 rounded">
                  <User className="w-4 h-4 text-text-muted" />
                  <span className="text-sm font-medium text-text">{user?.nombre}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="btn-primary font-semibold"
                >
                  Registrarse
                </Link>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text hover:text-accent transition-colors"
              aria-label="Menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-bg">
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="font-heading text-2xl font-bold uppercase tracking-tight text-text">
                UrbanFix
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-text hover:text-accent transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-accent'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && authNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-accent'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/mapa"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-text-muted hover:text-text transition-colors"
              >
                Ver mapa
              </Link>
            </nav>
            <div className="mt-auto pt-8 border-t border-line">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-surface-2 rounded">
                    <User className="w-4 h-4 text-text-muted" />
                    <span className="text-sm font-medium text-text">{user?.nombre}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg text-text-muted hover:text-text transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-accent text-accent-ink px-4 py-3 rounded font-semibold hover:bg-primary-hover transition-all duration-200 text-center"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
