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
      setLocationError('Fija la ubicación en el mapa o escribe latitud y longitud');
      toast.error('Falta la ubicación del reporte');
      return;
    }

    // Validar latitud y longitud
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
        // Usar multipart/form-data con archivo
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
        // Usar JSON sin archivo (URL opcional)
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
      <Card className="max-w-3xl mx-auto bg-surface border-line">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
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
            <p className="text-xs text-text-muted mt-1 text-right">
              {tituloValue.length}/200
            </p>
          </div>

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
              maxLength={2000}
              className="w-full h-32 px-4 py-3 border border-line bg-surface rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-text resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.descripcion && (
                <p className="text-sm text-error flex items-center gap-1">
                  <span className="text-xs">⚠</span>
                  {errors.descripcion.message as string}
                </p>
              )}
              <p className="text-xs text-text-muted ml-auto">
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

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Foto
            </label>
            
            {!selectedFile ? (
              <>
                <div className="mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-line rounded-lg cursor-pointer bg-surface hover:bg-surface-2 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-text-muted" />
                      <p className="text-sm text-text-muted">
                        <span className="font-medium">Click para subir</span> o arrastra y suelta
                      </p>
                      <p className="text-xs text-text-muted mt-1">PNG, JPG hasta 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                
                <div className="text-center text-sm text-text-muted mb-2">
                  O ingresa una URL
                </div>
                
                <Input
                  type="url"
                  {...register('fotoUrl', {
                    maxLength: { value: 500, message: 'Máximo 500 caracteres' },
                  })}
                  error={errors.fotoUrl?.message as string}
                  placeholder="https://ejemplo.com/foto.jpg"
                  maxLength={500}
                />
                <p className="text-xs text-text-muted mt-1 text-right">
                  {fotoUrlValue.length}/500
                </p>
              </>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl || ''}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-text-muted mt-2">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {isSubmitting ? 'Creando...' : 'Crear Reporte'}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
};
