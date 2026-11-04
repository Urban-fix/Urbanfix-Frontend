import React, { useState } from 'react';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { ReporteList as ReporteListComponent } from '../components/common/ReporteList';
import { ESTADOS_REPORTE } from '../utils/constants';
import { Input } from '../components/ui/Input';

export const ReporteList: React.FC = () => {
  const [estado, setEstado] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [zonaId, setZonaId] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { reportes, isLoading } = useReportes({ estado, categoriaId: Number(categoriaId) || undefined, zonaId: Number(zonaId) || undefined, search });
  const { categorias } = useCategorias();
  const { zonas } = useZonas();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Reportes
      </h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todos los estados</option>
            {Object.values(ESTADOS_REPORTE).map(estado => (
              <option key={estado} value={estado}>{estado.replace('_', ' ')}</option>
            ))}
          </select>
          
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          
          <select
            value={zonaId}
            onChange={(e) => setZonaId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todas las zonas</option>
            {zonas.map(zona => (
              <option key={zona.id} value={zona.id}>{zona.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <ReporteListComponent reportes={reportes} isLoading={isLoading} error={null} />
    </div>
  );
};
