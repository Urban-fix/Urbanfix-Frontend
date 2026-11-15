import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import {
  Highlight,
  HighlightItem,
} from '@animate-ui/react/primitives/effects/highlight';
import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from '@animate-ui/react/primitives/radix-ui/dialog';
import { useMisReportes } from '../hooks/useMisReportes';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ESTADOS_REPORTE } from '../utils/constants';
import { homeImages } from '../utils/homeMedia';
import { Trash2, Eye, Plus, Pencil, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const MisReportes: React.FC = () => {
  const { reportes, isLoading, deleteReporte, refetch } = useMisReportes();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<string>('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const estadoFilters = [
    { id: '', label: 'Todos' },
    ...Object.values(ESTADOS_REPORTE).map((est) => ({
      id: est,
      label: est.replace('_', ' '),
    })),
  ];

  const filteredReportes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reportes.filter((r) => {
      if (estado && r.estadoActual !== estado) return false;
      if (!q) return true;
      return (
        r.titulo.toLowerCase().includes(q) ||
        r.descripcion.toLowerCase().includes(q)
      );
    });
  }, [reportes, estado, search]);

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      setIsDeleting(true);
      await deleteReporte(deleteId);
      toast.success('Reporte eliminado exitosamente');
      setDeleteId(null);
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar reporte';
      toast.error(message);
    } finally {
      setIsDeleting(false);
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
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      }
    >
      <div className="space-y-8">
        <Effect fade slide={{ direction: 'up', offset: 14 }} inView>
          <div className="auth-filter-panel space-y-4">
            <Highlight hover defaultValue={estado || 'all'}>
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

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-[2.65rem] h-4 w-4 text-text-muted" />
              <Input
                label="Buscar"
                placeholder="Título o descripción…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-[2.55rem] rounded p-1 text-text-muted hover:text-text"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </Effect>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent" />
          </div>
        ) : filteredReportes.length === 0 ? (
          <Effect fade slide={{ direction: 'up', offset: 16 }} inView>
            <div className="auth-empty-card py-14 text-center">
              <p className="mb-2 font-heading text-xl uppercase text-text">
                Sin resultados
              </p>
              <p className="mb-5 text-text-secondary">
                {estado || search
                  ? 'No tienes reportes que coincidan con los filtros'
                  : 'No tienes reportes aún'}
              </p>
              {estado || search ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEstado('');
                    setSearch('');
                  }}
                >
                  Limpiar filtros
                </Button>
              ) : (
                <Button onClick={() => navigate('/informes/crear')}>
                  Crear primer reporte
                </Button>
              )}
            </div>
          </Effect>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 font-heading text-base uppercase leading-tight text-text">
                        {reporte.titulo}
                      </h3>
                      <StatusBadge
                        estado={
                          reporte.estadoActual as keyof typeof ESTADOS_REPORTE
                        }
                        showIcon={false}
                      />
                    </div>
                    <p className="mb-4 line-clamp-3 text-sm text-text-muted">
                      {reporte.descripcion}
                    </p>
                    <p className="mb-4 text-xs text-text-muted">
                      {new Date(reporte.fechaCreacion).toLocaleDateString(
                        'es-ES'
                      )}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/reportes/${reporte.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          navigate(`/reportes/${reporte.id}/editar`)
                        }
                        aria-label="Editar reporte"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteId(reporte.id)}
                        aria-label="Eliminar reporte"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              </Effect>
            ))}
          </div>
        )}
      </div>

      <DialogRoot
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteId(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm" />
          <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded border border-line bg-surface p-5 text-text shadow-elevated outline-none">
            <div className="mb-3 flex items-start justify-between gap-3">
              <DialogTitle className="font-heading text-lg uppercase tracking-tight">
                Eliminar reporte
              </DialogTitle>
              <DialogClose
                className="rounded p-1.5 text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Cerrar"
                disabled={isDeleting}
              >
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
            <DialogDescription className="mb-5 text-sm text-text-secondary">
              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar
              este reporte?
            </DialogDescription>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </AppShell>
  );
};
