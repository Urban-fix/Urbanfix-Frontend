import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import {
  Highlight,
  HighlightItem,
} from '@animate-ui/react/primitives/effects/highlight';
import { useMisReportes } from '../hooks/useMisReportes';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ESTADOS_REPORTE } from '../utils/constants';
import { homeImages } from '../utils/homeMedia';
import { Trash2, Eye, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export const MisReportes: React.FC = () => {
  const { reportes, isLoading, deleteReporte, refetch } = useMisReportes();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<string>('');

  const filteredReportes = estado
    ? reportes.filter((r) => r.estadoActual === estado)
    : reportes;

  const estadoFilters = [
    { id: '', label: 'Todos' },
    ...Object.values(ESTADOS_REPORTE).map((est) => ({
      id: est,
      label: est.replace('_', ' '),
    })),
  ];

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      return;
    }
    try {
      await deleteReporte(id);
      toast.success('Reporte eliminado exitosamente');
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar reporte';
      toast.error(message);
    }
  };

  return (
    <AppShell
      title="Mis Reportes"
      subtitle="Gestiona los reportes que has creado"
      action={
        <Button
          onClick={() => navigate('/informes/crear')}
          className="inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Reporte
        </Button>
      }
    >
      <div className="space-y-8">
        <Effect fade slide={{ direction: 'up', offset: 14 }} inView>
          <Highlight hover className="auth-filter-panel" defaultValue={estado || 'all'}>
            <div className="flex flex-wrap gap-2">
              {estadoFilters.map((filter) => (
                <HighlightItem
                  key={filter.id || 'all'}
                  value={filter.id || 'all'}
                >
                  <button
                    type="button"
                    onClick={() => setEstado(filter.id)}
                    className={`auth-filter-chip${
                      estado === filter.id ? ' is-active' : ''
                    }`}
                  >
                    {filter.label}
                  </button>
                </HighlightItem>
              ))}
            </div>
          </Highlight>
        </Effect>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : filteredReportes.length === 0 ? (
          <Effect fade slide={{ direction: 'up', offset: 16 }} inView>
            <div className="auth-empty-card text-center py-14">
              <p className="text-text-muted mb-5">
                {estado
                  ? 'No tienes reportes con este estado'
                  : 'No tienes reportes aún'}
              </p>
              <Button onClick={() => navigate('/informes/crear')}>
                Crear primer reporte
              </Button>
            </div>
          </Effect>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReportes.map((reporte, index) => (
              <Effect
                key={reporte.id}
                fade
                slide={{ direction: 'up', offset: 14 }}
                delay={0.04 * index}
                inView
              >
                <article className="auth-report-card overflow-hidden">
                  <div className="auth-report-media">
                    <img
                      src={reporte.fotoUrl || homeImages.baches}
                      alt={reporte.titulo}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-heading uppercase text-text text-base leading-tight line-clamp-2">
                        {reporte.titulo}
                      </h3>
                      <StatusBadge
                        estado={
                          reporte.estadoActual as keyof typeof ESTADOS_REPORTE
                        }
                        showIcon={false}
                      />
                    </div>
                    <p className="text-sm text-text-muted line-clamp-3 mb-4">
                      {reporte.descripcion}
                    </p>
                    <p className="text-xs text-text-muted mb-4">
                      {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES')}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/reportes/${reporte.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(reporte.id)}
                        aria-label="Eliminar reporte"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              </Effect>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};
