import React, { useState } from 'react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { useForm } from '../hooks/useForm';
import { useReportes } from '../hooks/useReportes';
import { useCategorias } from '../hooks/useCategorias';
import { useZonas } from '../hooks/useZonas';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AppShell } from '../components/layout/AppShell';
import {
  LocationMapPicker,
  type Coords,
} from '../components/map/LocationMapPicker';
import type { ReporteCreateDTO } from '../types/reporte.types';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';

export const ReporteCreate: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const { createReporte } = useReportes();
  const { categorias } = useCategorias();
  const { zonas } = useZonas();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Coords | null>(null);
  const [locationError, setLocationError] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const tituloValue = watch('titulo', '');
  const descripcionValue = watch('descripcion', '');
  const fotoUrlValue = watch('fotoUrl', '');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('El archivo no puede exceder 10MB');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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

    if (location.lat < -90 || location.lat > 90) {
      setLocationError('Latitud debe estar entre -90 y 90');
      toast.error('Latitud inválida');
      return;
    }
    if (location.lng < -180 || location.lng > 180) {
      setLocationError('Longitud debe estar entre -180 y 180');
      toast.error('Longitud inválida');
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

        await api.post('/api/v1/reportes', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        const reporteData: ReporteCreateDTO = {
          titulo: String(data.titulo),
          descripcion: String(data.descripcion),
          latitud: location.lat,
          longitud: location.lng,
          fotoUrl: data.fotoUrl ? String(data.fotoUrl) : undefined,
          categoriaId: Number(data.categoriaId),
          zonaId: Number(data.zonaId),
        };

        await createReporte(reporteData);
      }

      toast.success('Reporte creado exitosamente');
      navigate('/informes');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al crear reporte';
      toast.error(message);
    }
  };

  return (
    <AppShell
      title="Crear Reporte"
      subtitle="Reporta un problema en tu ciudad"
    >
      <Effect fade slide={{ direction: 'up', offset: 16 }} inView>
        <div className="auth-filter-panel mx-auto max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Título
              </label>
              <Input
                {...register('titulo', {
                  required: 'Título es requerido',
                  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
                  maxLength: { value: 200, message: 'Máximo 200 caracteres' },
                })}
                error={errors.titulo?.message as string}
                maxLength={200}
              />
              <p className="mt-1 text-right text-xs text-text-muted">
                {tituloValue.length}/200
              </p>
            </div>

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
                maxLength={2000}
                className="auth-textarea h-32"
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.descripcion && (
                  <p className="text-sm text-error">
                    {errors.descripcion.message as string}
                  </p>
                )}
                <p className="ml-auto text-xs text-text-muted">
                  {descripcionValue.length}/2000
                </p>
              </div>
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

              {!selectedFile ? (
                <>
                  <div className="mb-4">
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-line bg-surface-2 transition-colors hover:border-accent/50 hover:bg-surface">
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <Upload className="mb-2 h-8 w-8 text-accent" />
                        <p className="text-sm text-text-secondary">
                          <span className="font-medium text-text">
                            Click para subir
                          </span>{' '}
                          una imagen
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          PNG, JPG hasta 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>

                  <div className="mb-2 text-center text-sm text-text-muted">
                    O ingresa una URL
                  </div>

                  <Input
                    type="url"
                    {...register('fotoUrl', {
                      maxLength: {
                        value: 500,
                        message: 'Máximo 500 caracteres',
                      },
                    })}
                    error={errors.fotoUrl?.message as string}
                    placeholder="https://ejemplo.com/foto.jpg"
                    maxLength={500}
                  />
                  <p className="mt-1 text-right text-xs text-text-muted">
                    {fotoUrlValue.length}/500
                  </p>
                </>
              ) : (
                <div className="relative">
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
                    {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              {isSubmitting ? 'Creando…' : 'Crear Reporte'}
            </Button>
          </form>
        </div>
      </Effect>
    </AppShell>
  );
};
