import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { useReportes } from '../hooks/useReportes';
import { authApi } from '../api/auth';
import { Settings, Users, FileText, Map } from 'lucide-react';
import { useForm } from '../hooks/useForm';
import type { Rol } from '../types/auth.types';
import toast from 'react-hot-toast';

export const AdminPanel: React.FC = () => {
  const { categorias } = useCategorias();
  const { zonas } = useZonas();
  const { reportes } = useReportes();
  const [showCreateUser, setShowCreateUser] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const roles: Rol[] = ['CIUDADANO', 'ADMIN_MUNICIPAL', 'TECNICO', 'SUPERVISOR', 'OPERADOR', 'AUDITOR'];

  const onCreateUser = async (data: any) => {
    try {
      await authApi.createUserAsAdmin(data);
      toast.success('Usuario creado exitosamente');
      reset();
      setShowCreateUser(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    }
  };

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Gestión de Usuarios
            </h2>
            <Button onClick={() => setShowCreateUser(!showCreateUser)}>
              {showCreateUser ? 'Cancelar' : 'Crear Usuario'}
            </Button>
          </div>

          {showCreateUser && (
            <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <Input
                label="Nombre"
                {...register('nombre', { required: 'Nombre es requerido' })}
                error={errors.nombre?.message as string}
              />
              <Input
                label="Apellido"
                {...register('apellido', { required: 'Apellido es requerido' })}
                error={errors.apellido?.message as string}
              />
              <Input
                label="Email"
                type="email"
                {...register('email', { 
                  required: 'Email es requerido',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email inválido'
                  }
                })}
                error={errors.email?.message as string}
              />
              <Input
                label="Contraseña"
                type="password"
                {...register('password', { 
                  required: 'Contraseña es requerida',
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                })}
                error={errors.password?.message as string}
              />
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Rol
                </label>
                <select
                  {...register('rol', { required: 'Rol es requerido' })}
                  className="w-full h-12 px-4 border border-line bg-surface rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-text"
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
                {errors.rol && (
                  <p className="mt-2 text-sm text-error">{errors.rol.message as string}</p>
                )}
              </div>
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                {isSubmitting ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </form>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Gestión de Categorías
          </h2>
          <div className="space-y-2">
            {categorias.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-900 dark:text-white">{cat.nombre}</span>
              </div>
            ))}
            {categorias.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay categorías</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Gestión de Zonas
          </h2>
          <div className="space-y-2">
            {zonas.map(zona => (
              <div key={zona.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-900 dark:text-white">{zona.nombre}</span>
              </div>
            ))}
            {zonas.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay zonas</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
