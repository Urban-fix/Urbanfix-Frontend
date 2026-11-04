import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReportes } from '../hooks/useReportes';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ESTADO_COLORS } from '../utils/constants';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { reportes, isLoading } = useReportes({ usuarioId: user?.id });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    total: reportes.length,
    reportados: reportes.filter(r => r.estadoActual === 'REPORTADO').length,
    enProceso: reportes.filter(r => r.estadoActual === 'EN_PROCESO').length,
    resueltos: reportes.filter(r => r.estadoActual === 'RESUELTO').length,
  };

  const statCards = [
    {
      title: 'Total',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Reportados',
      value: stats.reportados,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      title: 'En Proceso',
      value: stats.enProceso,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Resueltos',
      value: stats.resueltos,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Resumen de tus reportes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`${stat.color} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8 opacity-80" />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Mis Reportes
        </h2>
        <Link to="/reportes/crear">
          <Button>Nuevo Reporte</Button>
        </Link>
      </div>

      {reportes.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">No tienes reportes aún</p>
          <Link to="/reportes/crear">
            <Button>Crear Primer Reporte</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportes.slice(0, 6).map(reporte => (
            <Link key={reporte.id} to={`/reportes/${reporte.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {reporte.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                  {reporte.descripcion}
                </p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[reporte.estadoActual]}`}>
                  {reporte.estadoActual.replace('_', ' ')}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
