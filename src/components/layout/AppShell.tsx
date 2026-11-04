import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FileText, Map, LayoutDashboard, User, LogOut, Menu } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children, title, subtitle, action }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/reportes', label: 'Reportes', icon: FileText },
    { path: '/mapa', label: 'Mapa', icon: Map },
    { path: '/perfil', label: 'Perfil', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-60 bg-surface border-r border-line
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-line">
            <Link to="/" className="font-heading text-xl font-bold uppercase tracking-tight text-text">
              UrbanFix
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:text-text hover:bg-surface-2'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-line">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{user?.nombre}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-text-muted hover:text-text transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-line bg-surface">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-text hover:text-accent transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="font-heading text-lg font-bold uppercase tracking-tight text-text">
            UrbanFix
          </Link>
          <div className="w-10" />
        </div>

        {/* Page header */}
        <div className="border-b border-line bg-bg">
          <div className="container">
            <div className="flex items-center justify-between py-8">
              <div>
                <h1 className="font-heading font-bold text-3xl uppercase tracking-tight text-text mb-2">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-text-muted">{subtitle}</p>
                )}
              </div>
              {action && <div className="hidden md:block">{action}</div>}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
