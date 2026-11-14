import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../../components/Screen';
import { ReporteCard } from '../../../components/ReporteCard';
import { Body, Button, EmptyState, ErrorBanner, Heading, IconWell, LinkText, SectionTitle, Skeleton, StatCard, type IconName } from '../../../components/ui';
import { useAuth } from '../../../context/AuthContext';
import { useMisReportes, useReportesPublic } from '../../../hooks/useData';
import { alpha, colors, radius, shadow, spacing } from '../../../theme/tokens';

/** Dashboard: mismas secciones que el web (accesos, Tu actividad, Comunidad, recientes). */
export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const mis = useMisReportes();
  const pub = useReportesPublic();
  const reportes = mis.data;

  const count = (list: { estadoActual: string }[], e: string) => list.filter((r) => r.estadoActual === e).length;

  const refresh = () => {
    mis.refetch();
    pub.refetch();
  };

  return (
    <Screen
      title="Dashboard"
      subtitle={`Bienvenido, ${user?.nombre ?? ''}`}
      refreshing={mis.isRefreshing}
      onRefresh={refresh}
      action={<Button title="Nuevo" icon="plus" size="sm" onPress={() => router.push('/crear')} />}
    >
      <View style={{ gap: spacing.xxl + 8 }}>
        {mis.error && <ErrorBanner message={mis.error} onRetry={mis.refetch} />}

        <View style={{ gap: spacing.md }}>
          <QuickCard icon="file-text" title="Informes" text="Explora reportes de la comunidad" onPress={() => router.push('/informes')} />
          <QuickCard icon="map" title="Mapa" text="Ubica problemas en el mapa" onPress={() => router.push('/mapa')} />
        </View>

        <View>
          <SectionTitle title="Tu actividad" />
          {mis.isLoading ? (
            <View style={styles.grid}>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} height={96} style={styles.half} />
              ))}
            </View>
          ) : (
            <View style={styles.grid}>
              <StatCard style={styles.half} label="Mis reportes" value={reportes.length} icon="file-text" tone="accent" />
              <StatCard style={styles.half} label="Pendientes" value={count(reportes, 'PENDIENTE')} icon="alert-circle" tone="warning" />
              <StatCard style={styles.half} label="En progreso" value={count(reportes, 'EN_PROGRESO')} icon="clock" tone="info" />
              <StatCard style={styles.half} label="Resueltos" value={count(reportes, 'RESUELTO')} icon="check-circle" tone="success" />
            </View>
          )}
        </View>

        <View>
          <SectionTitle title="Comunidad" />
          <View style={{ gap: spacing.md }}>
            <StatCard label="Pendientes globales" value={count(pub.data, 'PENDIENTE')} icon="trending-up" tone="accent" />
            <StatCard label="Resueltos globales" value={count(pub.data, 'RESUELTO')} icon="check-circle" tone="success" />
          </View>
        </View>

        <View>
          <SectionTitle
            title="Mis reportes recientes"
            right={
              reportes.length > 0 ? (
                <Pressable onPress={() => router.push('/perfil')}>
                  <LinkText>Ver todos</LinkText>
                </Pressable>
              ) : undefined
            }
          />
          {mis.isLoading ? (
            <View style={{ gap: spacing.lg }}>
              {[0, 1].map((i) => (
                <Skeleton key={i} height={260} />
              ))}
            </View>
          ) : reportes.length === 0 ? (
            <EmptyState title="Sin reportes aún" text="Aún no tienes reportes. Crea el primero." action={<Button title="Crear primer reporte" onPress={() => router.push('/crear')} />} />
          ) : (
            <View style={{ gap: spacing.lg }}>
              {reportes.slice(0, 6).map((r) => (
                <ReporteCard key={r.id} reporte={r} />
              ))}
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}

const QuickCard: React.FC<{ icon: IconName; title: string; text: string; onPress: () => void }> = ({ icon, title, text, onPress }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.quick, pressed && { borderColor: alpha(colors.accent, 0.6), transform: [{ translateY: -2 }] }]}>
    <IconWell icon={icon} />
    <View style={{ flex: 1 }}>
      <Heading size={17}>{title}</Heading>
      <Body secondary size={14}>
        {text}
      </Body>
    </View>
    <Feather name="arrow-right" size={20} color={colors.textMuted} />
  </Pressable>
);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  half: { width: '48%', flexGrow: 1 },
  quick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: 18,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
});
