import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MapView, Marker } from '../../../components/Map';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Chip, ErrorBanner, Heading, StatusBadge } from '../../../components/ui';
import { darkMapStyle } from '../../../components/mapStyle';
import { useReportesPublic } from '../../../hooks/useData';
import { DEFAULT_REGION, ESTADO_COLOR, ESTADOS_REPORTE, FALLBACK_IMAGE, estadoLabel } from '../../../utils/constants';
import { alpha, colors, fonts, radius, shadow, spacing } from '../../../theme/tokens';
import type { ReportePublicDTO } from '../../../types/reporte.types';

/** Mapa de reportes con leyenda por estado (igual que ReportesMapView web). */
export default function MapaScreen() {
  const router = useRouter();
  const { data, error, refetch } = useReportesPublic();
  const [estado, setEstado] = useState('');
  const [selected, setSelected] = useState<ReportePublicDTO | null>(null);

  const reportes = useMemo(
    () => data.filter((r) => Number.isFinite(r.latitud) && Number.isFinite(r.longitud) && (!estado || r.estadoActual === estado)),
    [data, estado],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={DEFAULT_REGION} customMapStyle={darkMapStyle} onPress={() => setSelected(null)} showsUserLocation>
        {reportes.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.latitud, longitude: r.longitud }}
            pinColor={ESTADO_COLOR[r.estadoActual]}
            onPress={(e) => {
              e.stopPropagation();
              setSelected(r);
            }}
          />
        ))}
      </MapView>

      <SafeAreaView edges={['top']} style={styles.top} pointerEvents="box-none">
        <View style={styles.toolbar}>
          <Heading size={22}>Mapa</Heading>
          <Text style={styles.count}>{reportes.length} reportes</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.gutter }}>
          <Chip label="Todos" active={!estado} onPress={() => setEstado('')} />
          {Object.values(ESTADOS_REPORTE).map((e) => (
            <Chip key={e} label={estadoLabel(e).toLowerCase()} active={estado === e} onPress={() => setEstado(e)} />
          ))}
        </ScrollView>
        {error && (
          <View style={{ paddingHorizontal: spacing.gutter, marginTop: spacing.sm }}>
            <ErrorBanner message={error} onRetry={refetch} />
          </View>
        )}
      </SafeAreaView>

      {selected ? (
        <Pressable style={styles.popup} onPress={() => router.push(`/reportes/${selected.id}`)}>
          <Image source={selected.fotoUrl || FALLBACK_IMAGE} style={styles.popupImg} contentFit="cover" />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.popupTitle} numberOfLines={2}>
              {selected.titulo}
            </Text>
            <StatusBadge estado={selected.estadoActual} showIcon={false} />
            <Text style={styles.popupMeta} numberOfLines={1}>
              {selected.zona?.nombre ?? 'Sin zona'} · {selected.categoria?.nombre}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.accent} />
        </Pressable>
      ) : (
        <View style={styles.legend} pointerEvents="none">
          {Object.values(ESTADOS_REPORTE).map((e) => (
            <View key={e} style={styles.legendItem}>
              <View style={[styles.swatch, { backgroundColor: ESTADO_COLOR[e] }]} />
              <Text style={styles.legendText}>{estadoLabel(e)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const panel = {
  borderRadius: radius,
  borderWidth: 1,
  borderColor: colors.line,
  backgroundColor: colors.surface,
  ...shadow.card,
};

const styles = StyleSheet.create({
  top: { position: 'absolute', top: 0, left: 0, right: 0, gap: spacing.sm },
  toolbar: { ...panel, marginHorizontal: spacing.gutter, marginTop: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13 },
  legend: { ...panel, position: 'absolute', left: spacing.md, bottom: spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 10, maxWidth: '92%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: colors.bg },
  legendText: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 11, textTransform: 'uppercase' },
  popup: { ...panel, position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderColor: alpha(colors.accent, 0.5) },
  popupImg: { width: 72, height: 72, borderRadius: radius, backgroundColor: colors.surface2 },
  popupTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 15, textTransform: 'uppercase' },
  popupMeta: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12 },
});
