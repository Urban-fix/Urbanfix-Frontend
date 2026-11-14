import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../../../components/Screen';
import { useToast } from '../../../../components/Toast';
import { Body, Button, Card, EmptyState, Heading, InfoRow, Input, Loader, Select, StatusBadge } from '../../../../components/ui';
import { useAuth } from '../../../../context/AuthContext';
import { useAsync } from '../../../../hooks/useAsync';
import { comentariosApi, confirmacionesApi, reportesApi } from '../../../../api/endpoints';
import { errorMessage } from '../../../../api/client';
import { ESTADOS_REPORTE, FALLBACK_IMAGE, estadoLabel } from '../../../../utils/constants';
import { formatDateTime } from '../../../../utils/formatters';
import { colors, fonts, radius, spacing } from '../../../../theme/tokens';
import type { ReporteDetailDTO } from '../../../../types/reporte.types';

export default function ReporteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const reporteId = Number(id);
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { data: reporte, isLoading, isRefreshing, refetch } = useAsync<ReporteDetailDTO | null>(() => reportesApi.getDetalle(reporteId), [reporteId], null, 'Error al cargar el reporte');

  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<string | ''>('');

  const puedeCambiarEstado = user?.rol === 'ADMIN_MUNICIPAL' || user?.rol === 'TECNICO' || user?.rol === 'SUPERVISOR';
  const esMio = reporte?.usuario?.id === user?.id;
  const hasConfirmed = !!reporte?.confirmaciones?.some((c) => c.id === user?.id);

  const toggleConfirm = async () => {
    setConfirming(true);
    try {
      if (hasConfirmed) {
        await confirmacionesApi.retirar(reporteId);
        toast.success('Confirmación retirada');
      } else {
        await confirmacionesApi.confirmar(reporteId);
        toast.success('Reporte confirmado');
      }
      await refetch();
    } catch (err) {
      toast.error(errorMessage(err, 'Error al confirmar reporte'));
    } finally {
      setConfirming(false);
    }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    setSending(true);
    try {
      await comentariosApi.create(reporteId, comment.trim());
      toast.success('Comentario agregado');
      setComment('');
      await refetch();
    } catch (err) {
      toast.error(errorMessage(err, 'Error al agregar comentario'));
    } finally {
      setSending(false);
    }
  };

  const cambiarEstado = async () => {
    if (!nuevoEstado) return;
    try {
      await reportesApi.cambiarEstado(reporteId, nuevoEstado);
      toast.success('Estado actualizado');
      setNuevoEstado('');
      await refetch();
    } catch (err) {
      toast.error(errorMessage(err, 'Error al cambiar estado'));
    }
  };

  if (isLoading) {
    return (
      <Screen title="Detalle" subtitle="Cargando reporte…" back scroll={false}>
        <Loader />
      </Screen>
    );
  }

  if (!reporte) {
    return (
      <Screen title="Detalle" subtitle="Reporte no encontrado" back>
        <EmptyState title="Reporte no encontrado" action={<Button title="Volver a Informes" onPress={() => router.navigate('/informes')} />} />
      </Screen>
    );
  }

  return (
    <Screen
      title={reporte.titulo}
      subtitle="Detalle del reporte ciudadano"
      back
      refreshing={isRefreshing}
      onRefresh={refetch}
      action={esMio ? <Button title="Editar" icon="edit-2" variant="secondary" size="sm" onPress={() => router.push(`/reportes/${reporteId}/editar`)} /> : undefined}
    >
      <View style={{ gap: spacing.lg }}>
        <Card padded={false} style={{ overflow: 'hidden' }}>
          <View style={styles.media}>
            <Image source={reporte.fotoUrl || FALLBACK_IMAGE} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} locations={[0.45, 1]} style={StyleSheet.absoluteFill} />
          </View>
          <View style={{ padding: spacing.xl, gap: spacing.lg }}>
            <View style={styles.between}>
              <StatusBadge estado={reporte.estadoActual} />
              <View style={styles.inline}>
                <Feather name="thumbs-up" size={15} color={colors.textMuted} />
                <Body muted size={14}>
                  {reporte.confirmacionesCount} confirmaciones
                </Body>
              </View>
            </View>

            <Body muted>{reporte.descripcion}</Body>

            <View style={{ gap: spacing.sm }}>
              <InfoRow icon="user" text={reporte.usuario?.nombre ?? '—'} />
              <InfoRow icon="map-pin" text={reporte.zona?.nombre ?? 'Sin zona'} />
              <InfoRow icon="tag" text={reporte.categoria?.nombre ?? 'Sin categoría'} />
              <InfoRow icon="calendar" text={formatDateTime(reporte.fechaCreacion)} />
            </View>

            <Button title={hasConfirmed ? 'Confirmado' : 'Confirmar'} icon="thumbs-up" variant={hasConfirmed ? 'secondary' : 'primary'} onPress={toggleConfirm} isLoading={confirming} />

            {puedeCambiarEstado && (
              <View style={styles.adminBox}>
                <Heading size={17}>Cambiar estado</Heading>
                <Select
                  placeholder="Seleccionar nuevo estado"
                  value={nuevoEstado}
                  options={Object.values(ESTADOS_REPORTE).map((e) => ({ value: e, label: estadoLabel(e) }))}
                  onChange={setNuevoEstado}
                />
                <Button title="Actualizar" onPress={cambiarEstado} disabled={!nuevoEstado} />
              </View>
            )}
          </View>
        </Card>

        <Card style={{ gap: spacing.md }}>
          <Heading size={20}>Comentarios ({reporte.comentarios?.length ?? 0})</Heading>
          <Input value={comment} onChangeText={setComment} placeholder="Escribe un comentario…" multiline style={{ minHeight: 70 }} />
          <Button title="Agregar comentario" size="sm" icon="send" onPress={addComment} isLoading={sending} disabled={!comment.trim()} style={{ alignSelf: 'flex-start' }} />
          {(reporte.comentarios ?? []).length === 0 ? (
            <Body muted size={14} style={{ textAlign: 'center', paddingVertical: spacing.lg }}>
              No hay comentarios aún
            </Body>
          ) : (
            reporte.comentarios.map((c) => (
              <View key={c.id} style={styles.comment}>
                <View style={styles.commentAvatar}>
                  <Feather name="user" size={16} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.between}>
                    <Text style={styles.commentName}>{c.usuario?.nombre}</Text>
                    <Text style={styles.commentDate}>{formatDateTime(c.fechaCreacion)}</Text>
                  </View>
                  <Body secondary size={14} style={{ marginTop: 2 }}>
                    {c.contenido}
                  </Body>
                </View>
              </View>
            ))
          )}
        </Card>

        <Card style={{ gap: spacing.lg }}>
          <Heading size={20}>Historial de estados</Heading>
          {(reporte.historialEstados ?? []).length === 0 ? (
            <Body muted size={14} style={{ textAlign: 'center', paddingVertical: spacing.lg }}>
              No hay historial
            </Body>
          ) : (
            reporte.historialEstados.map((h) => (
              <View key={h.id} style={styles.timeline}>
                <Text style={styles.timelineEstado}>{estadoLabel(h.estado)}</Text>
                <Body muted size={13}>
                  {formatDateTime(h.fechaCambio)}
                </Body>
                <Body muted size={13}>
                  Por: {h.usuario?.nombre}
                </Body>
              </View>
            ))
          )}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  media: { height: 230, backgroundColor: colors.surface2 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  adminBox: { gap: spacing.md, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.line },
  comment: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, borderRadius: radius, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212,245,140,0.12)' },
  commentName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  commentDate: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted },
  timeline: { borderLeftWidth: 2, borderLeftColor: colors.accent, paddingLeft: spacing.lg },
  timelineEstado: { fontFamily: fonts.medium, fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.text },
});
