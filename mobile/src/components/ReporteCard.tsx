import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { alpha, colors, fonts, radius, shadow, spacing } from '../theme/tokens';
import { FALLBACK_IMAGE } from '../utils/constants';
import { formatRelativeTime } from '../utils/formatters';
import type { ReportePublicDTO, ReporteResponseDTO } from '../types/reporte.types';
import { StatusBadge } from './ui';

/** Tarjeta de reporte (`.auth-report-card`): foto con degradado + datos. */
export const ReporteCard: React.FC<{ reporte: ReporteResponseDTO | ReportePublicDTO; compact?: boolean }> = ({ reporte, compact }) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/reportes/${reporte.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={reporte.titulo}
    >
      <View style={[styles.media, compact && { height: 130 }]}>
        <Image source={reporte.fotoUrl || FALLBACK_IMAGE} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} locations={[0.45, 1]} style={StyleSheet.absoluteFill} />
      </View>
      <View style={{ padding: spacing.lg }}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {reporte.titulo}
          </Text>
          <StatusBadge estado={reporte.estadoActual} showIcon={false} />
        </View>
        <Text style={styles.desc} numberOfLines={2}>
          {reporte.descripcion}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={13} color={colors.accent} />
            <Text style={styles.metaText} numberOfLines={1}>
              {reporte.zona?.nombre ?? 'Sin zona'}
            </Text>
          </View>
          {typeof reporte.confirmacionesCount === 'number' && (
            <View style={styles.metaItem}>
              <Feather name="thumbs-up" size={13} color={colors.textMuted} />
              <Text style={styles.metaText}>{reporte.confirmacionesCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.time}>{formatRelativeTime(reporte.fechaCreacion)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  pressed: { borderColor: alpha(colors.accent, 0.6), transform: [{ scale: 0.985 }] },
  media: { height: 160, backgroundColor: colors.surface2 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm, marginBottom: spacing.sm },
  title: { flex: 1, fontFamily: fonts.heading, fontSize: 16, lineHeight: 19, color: colors.text, textTransform: 'uppercase' },
  desc: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginBottom: spacing.md },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1 },
  metaText: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  time: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
});
