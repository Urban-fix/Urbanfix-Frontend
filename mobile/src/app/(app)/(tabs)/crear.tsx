import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '../../../components/Screen';
import { ReporteForm, buildReporteFormData, type ReporteFormValues } from '../../../components/ReporteForm';
import { useToast } from '../../../components/Toast';
import { reportesApi } from '../../../api/endpoints';
import { errorMessage } from '../../../api/client';

export default function CrearReporteScreen() {
  const router = useRouter();
  const toast = useToast();
  const [formKey, setFormKey] = useState(0); // para limpiar el formulario tras enviar

  const onSubmit = async (v: ReporteFormValues) => {
    try {
      if (v.photo) {
        await reportesApi.createWithPhoto(buildReporteFormData(v));
      } else {
        await reportesApi.create({
          titulo: v.titulo.trim(),
          descripcion: v.descripcion.trim(),
          latitud: v.location!.lat,
          longitud: v.location!.lng,
          fotoUrl: v.fotoUrl.trim() || undefined,
          categoriaId: Number(v.categoriaId),
          zonaId: Number(v.zonaId),
        });
      }
      toast.success('Reporte creado exitosamente');
      setFormKey((k) => k + 1);
      router.navigate('/informes');
    } catch (err) {
      toast.error(errorMessage(err, 'Error al crear reporte'));
    }
  };

  return (
    <Screen title="Crear Reporte" subtitle="Reporta un problema en tu ciudad">
      <ReporteForm key={formKey} submitLabel="Crear reporte" onSubmit={onSubmit} />
    </Screen>
  );
}
