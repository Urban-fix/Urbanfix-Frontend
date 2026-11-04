import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReportes } from '../hooks/useReportes';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AppShell } from '../components/layout/AppShell';
import { FileText, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { reportes, isLoading } = useReportes({ usuarioId: user?.id });

  if (isLoading) {
    return (
      <AppShell title="Dashboard" subtitle="Resumen de tus reportes">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </AppShell>
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
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      title: 'Reportados',
      value: stats.reportados,
      icon: AlertCircle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'En Proceso',
      value: stats.enProceso,
      icon: Clock,
      color: 'text-status-en-proceso',
      bg: 'bg-status-en-proceso/10',
    },
    {
      title: 'Resueltos',
      value: stats.resueltos,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle={`Bienvenido, ${user?.nombre}`}
      action={
        <Link to="/reportes/crear">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Reporte
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`${stat.bg} border-line`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">{stat.title}</h3>
                <p className={`text-3xl font-heading font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <h2 className="font-heading font-bold text-2xl uppercase tracking-tight text-text mb-6">
        Mis Reportes
      </h2>

      {reportes.length === 0 ? (
        <Card className="text-center py-12 bg-surface border-line">
          <p className="text-text-muted mb-4">No tienes reportes aún</p>
          <Link to="/reportes/crear">
            <Button>Crear Primer Reporte</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportes.slice(0, 6).map(reporte => (
            <Link key={reporte.id} to={`/reportes/${reporte.id}`}>
              <Card className="bg-surface border-line hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-heading font-semibold text-lg uppercase text-text mb-2 line-clamp-2">
                  {reporte.titulo}
                </h3>
                <p className="text-text-muted text-sm line-clamp-2 mb-3">
                  {reporte.descripcion}
                </p>
                <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-surface-2 text-text-muted">
                  {reporte.estadoActual.replace('_', ' ')}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
};
