import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import {
  Highlight,
  HighlightItem,
} from '@animate-ui/react/primitives/effects/highlight';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { ReporteList as ReporteListComponent } from '../components/common/ReporteList';
import { AppShell } from '../components/layout/AppShell';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ESTADOS_REPORTE } from '../utils/constants';
import { Plus, Search, X } from 'lucide-react';

export const ReporteList: React.FC = () => {
  const [estado, setEstado] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [zonaId, setZonaId] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { reportes, isLoading, error, refetch } = useReportes({
    estado,
    categoriaId: Number(categoriaId) || undefined,
    zonaId: Number(zonaId) || undefined,
    search,
  });
  const { categorias } = useCategorias();
  const { zonas } = useZonas();

  const estadoFilters = [
    { id: '', label: 'Todos' },
    ...Object.values(ESTADOS_REPORTE).map((est) => ({
      id: est,
      label: est.replace('_', ' '),
    })),
  ];

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (estado) {
    activeChips.push({
      key: 'estado',
      label: `Estado: ${estado.replace('_', ' ')}`,
      clear: () => setEstado(''),
    });
  }
  if (categoriaId) {
    const cat = categorias.find((c) => String(c.id) === categoriaId);
    activeChips.push({
      key: 'categoria',
      label: `Categoría: ${cat?.nombre ?? categoriaId}`,
      clear: () => setCategoriaId(''),
    });
  }
  if (zonaId) {
    const zona = zonas.find((z) => String(z.id) === zonaId);
    activeChips.push({
      key: 'zona',
      label: `Zona: ${zona?.nombre ?? zonaId}`,
      clear: () => setZonaId(''),
    });
  }
  if (search.trim()) {
    activeChips.push({
      key: 'search',
      label: `Buscar: ${search.trim()}`,
      clear: () => setSearch(''),
    });
  }

  const clearAll = () => {
    setEstado('');
    setCategoriaId('');
    setZonaId('');
    setSearch('');
  };

  return (
    <AppShell
      title="Informes"
      subtitle="Explora todos los reportes de la comunidad"
      action={
        <Link to="/informes/crear">
          <Button className="inline-flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Reporte
          </Button>
        </Link>
      }
    >
      <div className="space-y-8">
        <div className="auth-filter-sticky">
          <Effect fade slide={{ direction: 'up', offset: 16 }} inView>
            <div className="auth-filter-panel">
              <Highlight hover className="mb-5" defaultValue={estado || 'all'}>
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-[2.65rem] h-4 w-4 text-text-muted" />
                  <Input
                    label="Buscar"
                    placeholder="Título o descripción…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Categoría
                  </label>
                  <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="auth-select"
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Zona
                  </label>
                  <select
                    value={zonaId}
                    onChange={(e) => setZonaId(e.target.value)}
                    className="auth-select"
                  >
                    <option value="">Todas las zonas</option>
                    {zonas.map((zona) => (
                      <option key={zona.id} value={zona.id}>
                        {zona.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {activeChips.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {activeChips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={chip.clear}
                      className="inline-flex items-center gap-1.5 rounded border border-line bg-surface-2 px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent hover:text-text"
                    >
                      {chip.label}
                      <X className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">Quitar filtro</span>
                    </button>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Limpiar
                  </Button>
                </div>
              )}
            </div>
          </Effect>
        </div>

        <Effect fade slide={{ direction: 'up', offset: 14 }} delay={0.08} inView>
          {error ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-error/30 bg-error/10 p-4 text-sm text-error">
              <p>{error}</p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded bg-surface-2"
                />
              ))}
            </div>
          ) : reportes.length === 0 ? (
            <div className="auth-empty-card py-14 text-center">
              <p className="mb-2 font-heading text-xl uppercase text-text">
                Sin resultados
              </p>
              <p className="mb-5 text-text-secondary">
                No hay reportes que coincidan con los filtros
              </p>
              {activeChips.length > 0 && (
                <Button variant="secondary" onClick={clearAll}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <ReporteListComponent
              reportes={reportes}
              isLoading={false}
              error={null}
            />
          )}
        </Effect>
      </div>
    </AppShell>
  );
};
