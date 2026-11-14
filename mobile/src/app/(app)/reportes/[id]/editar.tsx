import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../../../components/Screen';
import { ReporteForm, type ReporteFormValues } from '../../../../components/ReporteForm';
import { useToast } from '../../../../components/Toast';
import { EmptyState, Loader } from '../../../../components/ui';
import { useAsync } from '../../../../hooks/useAsync';
import { reportesApi } from '../../../../api/endpoints';
import { errorMessage } from '../../../../api/client';
import type { ReporteDetailDTO } from '../../../../types/reporte.types';

export default function ReporteEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const reporteId = Number(id);
  const router = useRouter();
  const toast = useToast();
  const { data: reporte, isLoading } = useAsync<ReporteDetailDTO | null>(() => reportesApi.getDetalle(reporteId), [reporteId], null, 'Error al cargar el reporte');

  const onSubmit = async (v: ReporteFormValues) => {
    try {
      // PUT es JSON (igual que ReporteEdit web): la foto se cambia por URL
      await reportesApi.update(reporteId, {
        titulo: v.titulo.trim(),
        descripcion: v.descripcion.trim(),
        latitud: v.location!.lat,
        longitud: v.location!.lng,
        fotoUrl: v.fotoUrl.trim() || undefined,
        categoriaId: Number(v.categoriaId),
        zonaId: Number(v.zonaId),
      });
      toast.success('Reporte actualizado');
      router.back();
    } catch (err) {
      toast.error(errorMessage(err, 'Error al actualizar reporte'));
    }
  };

  return (
    <Screen title="Editar Reporte" subtitle="Actualiza la información de tu reporte" back scroll={!isLoading}>
      {isLoading ? (
        <Loader />
      ) : !reporte ? (
        <EmptyState title="Reporte no encontrado" />
      ) : (
        <ReporteForm
          submitLabel="Guardar cambios"
          allowPhotoUpload={false}
          initial={{
            titulo: reporte.titulo,
            descripcion: reporte.descripcion,
            categoriaId: reporte.categoria?.id ?? '',
            zonaId: reporte.zona?.id ?? '',
            fotoUrl: reporte.fotoUrl ?? '',
            location: { lat: reporte.latitud, lng: reporte.longitud },
          }}
          onSubmit={onSubmit}
        />
      )}
    </Screen>
  );
}
