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
    <aside className="w-64 bg-white shadow-md dark:bg-gray-800 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Menú</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          {user?.rol === 'ADMIN_MUNICIPAL' && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              {adminMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};
