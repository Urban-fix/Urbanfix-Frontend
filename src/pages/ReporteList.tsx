import React, { useState } from 'react';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { ReporteList as ReporteListComponent } from '../components/common/ReporteList';
import { AppShell } from '../components/layout/AppShell';
import { Chip } from '../components/ui/Chip';
import { Input } from '../components/ui/Input';
import { ESTADOS_REPORTE } from '../utils/constants';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReporteList: React.FC = () => {
  const [estado, setEstado] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [zonaId, setZonaId] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { reportes, isLoading } = useReportes({ estado, categoriaId: Number(categoriaId) || undefined, zonaId: Number(zonaId) || undefined, search });
  const { categorias } = useCategorias();
  const { zonas } = useZonas();

  return (
    <AppShell
      title="Reportes"
      subtitle="Explora todos los reportes de la comunidad"
      action={
        <Link to="/reportes/crear">
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-ink rounded font-semibold h-12 uppercase">
            <Plus className="w-5 h-5" />
            <span>Nuevo Reporte</span>
          </button>
        </Link>
      }
    >
      {/* Filtros */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <Chip active={!estado} onClick={() => setEstado('')}>
            Todos
          </Chip>
          {Object.values(ESTADOS_REPORTE).map(est => (
            <Chip 
              key={est} 
              active={estado === est}
              onClick={() => setEstado(estado === est ? '' : est)}
            >
              {est.replace('_', ' ')}
            </Chip>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Buscar"
            placeholder="Buscar por título o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full h-12 px-4 border border-line bg-surface rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-text"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Zona</label>
            <select
              value={zonaId}
              onChange={(e) => setZonaId(e.target.value)}
              className="w-full h-12 px-4 border border-line bg-surface rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-text"
            >
              <option value="">Todas las zonas</option>
              {zonas.map(zona => (
                <option key={zona.id} value={zona.id}>{zona.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ReporteListComponent reportes={reportes} isLoading={isLoading} error={null} />
    </AppShell>
  );
};
