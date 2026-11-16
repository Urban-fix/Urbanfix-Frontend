import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shine } from '@animate-ui/react/primitives/effects/shine';
import { Magnetic } from '@animate-ui/react/primitives/effects/magnetic';
import { useAuth } from '../../hooks/useAuth';
import { User, FileText, LayoutDashboard, UserCircle, Menu, LogOut, Home } from 'lucide-react';
import { MobileNavSheet } from './MobileNavSheet';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const navItems: { path: string; label: string }[] = [];

  const authNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/informes', label: 'Informes', icon: FileText },
    { path: '/perfil', label: 'Perfil', icon: UserCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="container">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="font-heading text-2xl font-bold uppercase tracking-tight text-text"
              data-testid="logo"
            >
              <span className="inline-block">Urban</span><span className="text-accent inline-block">Fix</span>
            </Link>
          </div>

          <nav className="nav hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium ${
                  isActive(item.path) ? 'bg-accent text-accent-ink' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-2 rounded bg-surface-2 px-3 py-1.5">
                  <User className="h-4 w-4 text-text-muted" />
                  <span className="text-sm font-medium text-text">
                    {user?.nombre}
                  </span>
                </div>
                <Magnetic strength={0.15} onlyOnHover>
                  <Shine
                    enableOnHover
                    color="rgba(212,245,140,0.15)"
                    className="inline-block"
                  >
                    <button
                      type="button"
                      onClick={handleGoHome}
                      className="inline-flex items-center gap-2 rounded border border-line bg-surface px-3 py-1.5 text-sm font-medium text-text transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </button>
                  </Shine>
                </Magnetic>
                <Magnetic strength={0.15} onlyOnHover>
                  <Shine
                    enableOnHover
                    color="rgba(239,68,68,0.15)"
                    className="inline-block"
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 rounded border border-error/30 bg-error/10 px-3 py-1.5 text-sm font-medium text-error transition-colors duration-200 hover:border-error hover:bg-error/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Salir
                    </button>
                  </Shine>
                </Magnetic>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Magnetic strength={0.15} onlyOnHover>
                  <Link
                    to="/login"
                    className="btn-secondary text-sm font-semibold min-w-[140px] text-center h-10"
                  >
                    Iniciar sesión
                  </Link>
                </Magnetic>
                <Magnetic strength={0.15} onlyOnHover>
                  <Shine
                    enableOnHover
                    color="rgba(212,245,140,0.25)"
                    className="inline-block"
                  >
                    <Link to="/register" className="btn-primary text-sm font-semibold min-w-[140px] text-center h-10">
                      Registrarse
                    </Link>
                  </Shine>
                </Magnetic>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded p-2 text-text transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
              aria-label="Menú"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileNavSheet
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        userName={user?.nombre}
        authLinks={authNavItems.map(({ path, label }) => ({ path, label }))}
        onLogout={handleLogout}
      />
    </header>
  );
};
