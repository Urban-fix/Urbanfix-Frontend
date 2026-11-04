import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, User, Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              UrbanFix
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link to="/reportes" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
              Reportes
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
                  Dashboard
                </Link>
                <Link to="/reportes/crear" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
                  Nuevo Reporte
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.nombre}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Registrarse
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
