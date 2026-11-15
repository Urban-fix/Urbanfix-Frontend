import React, { useState, useEffect } from 'react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AppShell } from '../components/layout/AppShell';
import { Spinner } from '../components/ui/Spinner';
import {
  LocationMapPicker,
  type Coords,
} from '../components/map/LocationMapPicker';
import type { ReporteUpdateDTO } from '../types/reporte.types';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';

export const ReporteEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    watch,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingFotoUrl, setExistingFotoUrl] = useState<string | undefined>();

  const fotoUrlValue = watch('fotoUrl', '');

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await api.get(`/api/v1/reportes/${id}`);
        const data = response.data;
        setLocation({ lat: data.latitud, lng: data.longitud });
        setExistingFotoUrl(data.fotoUrl || undefined);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('El archivo no puede exceder 10MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!location) {
      setLocationError(
        'Fija la ubicación en el mapa o escribe latitud y longitud'
      );
      toast.error('Falta la ubicación del reporte');
      return;
    }

    setLocationError(undefined);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('titulo', String(data.titulo));
        formData.append('descripcion', String(data.descripcion));
        formData.append('latitud', String(location.lat));
        formData.append('longitud', String(location.lng));
        formData.append('categoriaId', String(data.categoriaId));
        formData.append('zonaId', String(data.zonaId));
        formData.append('foto', selectedFile);

        await api.put(`/api/v1/reportes/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
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
      }

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

  const previewSrc = previewUrl || existingFotoUrl;

  return (
    <AppShell
      title="Editar Reporte"
      subtitle="Actualiza los datos y la ubicación en el mapa"
    >
      <Effect fade slide={{ direction: 'up', offset: 16 }} inView>
        <div className="auth-filter-panel mx-auto max-w-3xl">
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
              <label className="mb-2 block text-sm font-medium text-text">
                Descripción
              </label>
              <textarea
                {...register('descripcion', {
                  required: 'Descripción es requerida',
                  minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                  maxLength: { value: 2000, message: 'Máximo 2000 caracteres' },
                })}
                className="auth-textarea h-32"
              />
              {errors.descripcion && (
                <p className="mt-2 text-sm text-error">
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
              <label className="mb-2 block text-sm font-medium text-text">
                Categoría
              </label>
              <select
                {...register('categoriaId', {
                  required: 'Categoría es requerida',
                })}
                className="auth-select"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <p className="mt-2 text-sm text-error">
                  {errors.categoriaId.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Zona
              </label>
              <select
                {...register('zonaId', { required: 'Zona es requerida' })}
                className="auth-select"
              >
                <option value="">Selecciona una zona</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.nombre}
                  </option>
                ))}
              </select>
              {errors.zonaId && (
                <p className="mt-2 text-sm text-error">
                  {errors.zonaId.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Foto
              </label>

              {previewSrc && !selectedFile && (
                <img
                  src={previewSrc}
                  alt="Foto actual"
                  className="mb-3 h-40 w-full rounded object-cover"
                />
              )}

              {selectedFile ? (
                <div className="relative mb-3">
                  <img
                    src={previewUrl || ''}
                    alt="Vista previa"
                    className="h-48 w-full rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute right-2 top-2 rounded bg-error p-2 text-white transition-colors hover:bg-error/90"
                    aria-label="Quitar foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="mt-2 text-xs text-text-muted">
                    {selectedFile.name}
                  </p>
                </div>
              ) : (
                <label className="mb-4 flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-line bg-surface-2 transition-colors hover:border-accent/50">
                  <Upload className="mb-1 h-6 w-6 text-accent" />
                  <span className="text-sm text-text-secondary">
                    Subir nueva imagen
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              )}

              <Input
                label="URL de Foto (opcional)"
                type="url"
                {...register('fotoUrl')}
                error={errors.fotoUrl?.message as string}
              />
              {fotoUrlValue ? (
                <p className="mt-1 text-right text-xs text-text-muted">
                  {String(fotoUrlValue).length} caracteres
                </p>
              ) : null}
            </div>

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
        </div>
      </Effect>
    </AppShell>
  );
};
