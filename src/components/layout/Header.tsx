import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, FileText, LayoutDashboard, UserCircle, Menu } from 'lucide-react';
import { MobileNavSheet } from './MobileNavSheet';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            >
              Urban<span className="text-accent">Fix</span>
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
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  to="/login"
                  className="btn-secondary text-sm font-semibold min-w-[140px] text-center"
                >
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn-primary font-semibold min-w-[140px] text-center">
                  Registrarse
                </Link>
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
