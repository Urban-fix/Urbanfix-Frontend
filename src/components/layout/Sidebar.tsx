import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, FileText, PlusCircle, User as UserIcon, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/reportes', icon: FileText, label: 'Reportes' },
    { path: '/reportes/crear', icon: PlusCircle, label: 'Nuevo Reporte' },
    { path: '/perfil', icon: UserIcon, label: 'Mi Perfil' },
  ];

  const adminMenuItems = [
    { path: '/admin', icon: Settings, label: 'Panel Admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-6">MENÚ</h2>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {user?.rol === 'ADMIN_MUNICIPAL' && (
            <>
              <div className="border-t border-border my-4"></div>
              {adminMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};
