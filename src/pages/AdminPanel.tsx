import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { useReportes } from '../hooks/useReportes';
import { Settings, Users, FileText, Map } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { categorias } = useCategorias();
  const { zonas } = useZonas();
  const { reportes } = useReportes();

  const stats = [
    {
      title: 'Total Reportes',
      value: reportes.length,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Categorías',
      value: categorias.length,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Zonas',
      value: zonas.length,
      icon: Map,
      color: 'bg-purple-500',
    },
    {
      title: 'Usuarios Activos',
      value: 'N/A',
      icon: Settings,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Panel de Administración
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Gestión de Categorías
          </h2>
          <div className="space-y-2">
            {categorias.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-900 dark:text-white">{cat.nombre}</span>
                <Button variant="ghost" size="sm">Editar</Button>
              </div>
            ))}
            {categorias.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay categorías</p>
            )}
          </div>
          <Button className="w-full mt-4">Agregar Categoría</Button>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Gestión de Zonas
          </h2>
          <div className="space-y-2">
            {zonas.map(zona => (
              <div key={zona.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-900 dark:text-white">{zona.nombre}</span>
                <Button variant="ghost" size="sm">Editar</Button>
              </div>
            ))}
            {zonas.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay zonas</p>
            )}
          </div>
          <Button className="w-full mt-4">Agregar Zona</Button>
        </Card>
      </div>
    </div>
  );
};
