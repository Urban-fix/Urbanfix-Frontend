import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useReportes } from '../hooks/useReportes';
import { ReporteList } from '../components/common/ReporteList';

export const Home: React.FC = () => {
  const { reportes, isLoading } = useReportes();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">UrbanFix</h1>
          <p className="text-xl mb-8">Reporta problemas urbanos y mejora tu ciudad</p>
          <div className="flex justify-center space-x-4">
            <Link to="/reportes">
              <Button variant="secondary" size="lg">
                Ver Reportes
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg">
                Únete Ahora
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Reportes Recientes
        </h2>
        <ReporteList reportes={reportes.slice(0, 6)} isLoading={isLoading} error={null} />
        
        <div className="text-center mt-8">
          <Link to="/reportes">
            <Button variant="secondary">Ver Todos los Reportes</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            ¿Cómo Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                1. Reporta
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Describe el problema urbano que encuentres en tu ciudad
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                2. Ubica
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Proporciona la ubicación exacta del problema
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                3. Seguimiento
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Haz seguimiento al estado de tu reporte
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
