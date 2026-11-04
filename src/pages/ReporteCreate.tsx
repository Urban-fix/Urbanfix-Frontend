import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AppShell } from '../components/layout/AppShell';
import type { ReporteCreateDTO } from '../types/reporte.types';
import toast from 'react-hot-toast';
import { MapPin, Upload } from 'lucide-react';

export const ReporteCreate: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { createReporte } = useReportes();
  const { categorias } = useCategorias();
  const { zonas } = useZonas();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => toast.error('No se pudo obtener la ubicación')
      );
    } else {
      toast.error('Geolocalización no soportada');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const reporteData: ReporteCreateDTO = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        latitud: location?.lat || Number(data.latitud),
        longitud: location?.lng || Number(data.longitud),
        fotoUrl: data.fotoUrl,
        categoriaId: Number(data.categoriaId),
        zonaId: Number(data.zonaId),
      };
      
      await createReporte(reporteData);
      toast.success('Reporte creado exitosamente');
      navigate('/reportes');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear reporte');
    }
  };

  return (
    <AppShell
      title="Crear Reporte"
      subtitle="Reporta un problema en tu ciudad"
    >
      <Card className="max-w-2xl mx-auto bg-surface border-line">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Título"
            {...register('titulo', { 
              required: 'Título es requerido',
              minLength: { value: 5, message: 'Mínimo 5 caracteres' },
              maxLength: { value: 200, message: 'Máximo 200 caracteres' }
            })}
            error={errors.titulo?.message as string}
          />

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Descripción
            </label>
            <textarea
              {...register('descripcion', { 
                required: 'Descripción es requerida',
                minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                maxLength: { value: 2000, message: 'Máximo 2000 caracteres' }
              })}
              className="w-full h-32 px-4 py-3 border border-line bg-surface rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-text resize-none"
            />
            {errors.descripcion && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {errors.descripcion.message as string}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={getLocation}
              className="flex items-center"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Obtener Ubicación
            </Button>
            {location && (
              <span className="text-sm text-text-muted">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitud"
              type="number"
              step="any"
              {...register('latitud', { 
                required: location ? false : 'Latitud es requerida',
                min: { value: -90, message: 'Mínimo -90' },
                max: { value: 90, message: 'Máximo 90' }
              })}
              error={errors.latitud?.message as string}
              value={location?.lat}
              disabled={!!location}
            />
            <Input
              label="Longitud"
              type="number"
              step="any"
              {...register('longitud', { 
                required: location ? false : 'Longitud es requerida',
                min: { value: -180, message: 'Mínimo -180' },
                max: { value: 180, message: 'Máximo 180' }
              })}
              error={errors.longitud?.message as string}
              value={location?.lng}
              disabled={!!location}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Categoría
            </label>
            <select
              {...register('categoriaId', { required: 'Categoría es requerida' })}
              className="w-full h-12 px-4 border border-line bg-surface rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-text"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            {errors.categoriaId && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {errors.categoriaId.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Zona
            </label>
            <select
              {...register('zonaId', { required: 'Zona es requerida' })}
              className="w-full h-12 px-4 border border-line bg-surface rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-text"
            >
              <option value="">Selecciona una zona</option>
              {zonas.map(zona => (
                <option key={zona.id} value={zona.id}>{zona.nombre}</option>
              ))}
            </select>
            {errors.zonaId && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {errors.zonaId.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Foto (opcional)
            </label>
            <div
              className={`
                border-2 border-dashed rounded p-8 text-center transition-all duration-200
                ${isDragging ? 'border-accent bg-accent/5' : 'border-line bg-surface-2'}
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
            >
              <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">
                Arrastra una imagen aquí o
              </p>
              <Input
                label=""
                type="url"
                {...register('fotoUrl')}
                error={errors.fotoUrl?.message as string}
                placeholder="O ingresa la URL de la imagen"
                className="mt-4"
              />
            </div>
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {isSubmitting ? 'Creando...' : 'Crear Reporte'}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
};
