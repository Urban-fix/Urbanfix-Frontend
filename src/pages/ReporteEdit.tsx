import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AppShell } from '../components/layout/AppShell';
import { Spinner } from '../components/ui/Spinner';
import {
  LocationMapPicker,
  type Coords,
} from '../components/map/LocationMapPicker';
import type { ReporteUpdateDTO } from '../types/reporte.types';
import { api } from '../api/axios';
import toast from 'react-hot-toast';

export const ReporteEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { updateReporte } = useReportes();
  const { categorias } = useCategorias();
  const { zonas } = useZonas();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<Coords | null>(null);
  const [locationError, setLocationError] = useState<string | undefined>();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await api.get(`/api/v1/reportes/${id}`);
        const data = response.data;
        setLocation({ lat: data.latitud, lng: data.longitud });
        reset({
          titulo: data.titulo,
          descripcion: data.descripcion,
          fotoUrl: data.fotoUrl,
          categoriaId: data.categoria?.id ?? data.categoriaId,
          zonaId: data.zona?.id ?? data.zonaId,
        });
      } catch {
        toast.error('Error al cargar el reporte');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReporte();
  }, [id, reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!location) {
      setLocationError('Fija la ubicación en el mapa o escribe latitud y longitud');
      toast.error('Falta la ubicación del reporte');
      return;
    }

    setLocationError(undefined);

    try {
      const reporteData: ReporteUpdateDTO = {
        titulo: String(data.titulo),
        descripcion: String(data.descripcion),
        latitud: location.lat,
        longitud: location.lng,
        fotoUrl: data.fotoUrl ? String(data.fotoUrl) : undefined,
        categoriaId: Number(data.categoriaId),
        zonaId: Number(data.zonaId),
      };

      await updateReporte(Number(id), reporteData);
      toast.success('Reporte actualizado exitosamente');
      navigate(`/reportes/${id}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al actualizar reporte';
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <AppShell title="Editar Reporte">
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Editar Reporte"
      subtitle="Actualiza los datos y la ubicación en el mapa"
    >
      <Card className="max-w-3xl mx-auto bg-surface border-line">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Título"
            {...register('titulo', {
              required: 'Título es requerido',
              minLength: { value: 5, message: 'Mínimo 5 caracteres' },
              maxLength: { value: 200, message: 'Máximo 200 caracteres' },
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
                maxLength: { value: 2000, message: 'Máximo 2000 caracteres' },
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

          <LocationMapPicker
            value={location}
            onChange={(coords) => {
              setLocation(coords);
              setLocationError(undefined);
            }}
            error={locationError}
          />

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Categoría
            </label>
            <select
              {...register('categoriaId', { required: 'Categoría es requerida' })}
              className="w-full h-12 px-4 border border-line bg-surface rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-text"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
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
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.nombre}
                </option>
              ))}
            </select>
            {errors.zonaId && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {errors.zonaId.message as string}
              </p>
            )}
          </div>

          <Input
            label="URL de Foto (opcional)"
            type="url"
            {...register('fotoUrl')}
            error={errors.fotoUrl?.message as string}
          />

          <div className="flex flex-wrap gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              Actualizar Reporte
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/reportes/${id}`)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
};
