import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../../components/Screen';
import { useToast } from '../../../components/Toast';
import { Body, Button, Card, EmptyState, ErrorBanner, Heading, InfoRow, Kicker, Skeleton, StatusBadge } from '../../../components/ui';
import { useAuth } from '../../../context/AuthContext';
import { useMisReportes } from '../../../hooks/useData';
import { reportesApi } from '../../../api/endpoints';
import { errorMessage } from '../../../api/client';
import { alpha, colors, fonts, radius, spacing } from '../../../theme/tokens';
import { formatDateTime, formatRelativeTime } from '../../../utils/formatters';

type Tab = 'reportes' | 'datos' | 'seguridad';

/** Perfil + Mis reportes (en el web son dos páginas; aquí van como pestañas). */
export default function PerfilScreen() {
  const router = useRouter();
  const toast = useToast();
  const { user, logout } = useAuth();
  const mis = useMisReportes();
  const [tab, setTab] = useState<Tab>('reportes');

  if (!user) return null;

  const initials = `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase() || 'U';
  const rolLabel = user.rol === 'CIUDADANO' ? 'Ciudadano' : user.rol === 'ADMIN_MUNICIPAL' ? 'Administrador Municipal' : user.rol.replace('_', ' ');

  const confirmLogout = () =>
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await logout();
          toast.success('Sesión cerrada');
        },
      },
    ]);

  const confirmDelete = (id: number) =>
    Alert.alert('Eliminar reporte', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await reportesApi.remove(id);
            mis.setData((list) => list.filter((r) => r.id !== id));
            toast.success('Reporte eliminado');
          } catch (err) {
            toast.error(errorMessage(err, 'Error al eliminar reporte'));
          }
        },
      },
    ]);

  return (
    <Screen title="Mi Perfil" subtitle="Gestiona tu información de cuenta" refreshing={mis.isRefreshing} onRefresh={mis.refetch}>
      <View style={{ gap: spacing.lg }}>
        <Card style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Kicker>Cuenta</Kicker>
            <Heading size={22}>
              {user.nombre} {user.apellido}
            </Heading>
            <Body secondary size={14} numberOfLines={1}>
              {user.email}
            </Body>
            <View style={styles.rol}>
              <Text style={styles.rolText}>{rolLabel}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.tabs}>
          {(
            [
              ['reportes', 'Mis reportes'],
              ['datos', 'Datos'],
              ['seguridad', 'Seguridad'],
            ] as const
          ).map(([k, label]) => (
            <Pressable key={k} onPress={() => setTab(k)} style={[styles.tab, tab === k && styles.tabActive]}>
              <Text style={[styles.tabText, tab === k && { color: colors.onAccent }]}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'reportes' && (
          <View style={{ gap: spacing.md }}>
            {mis.error && <ErrorBanner message={mis.error} onRetry={mis.refetch} />}
            {mis.isLoading ? (
              [0, 1, 2].map((i) => <Skeleton key={i} height={84} />)
            ) : mis.data.length === 0 ? (
              <EmptyState title="Sin reportes aún" text="Cuando crees un reporte aparecerá aquí." action={<Button title="Crear reporte" onPress={() => router.push('/crear')} />} />
            ) : (
              mis.data.map((r) => (
                <Pressable key={r.id} onPress={() => router.push(`/reportes/${r.id}`)} style={({ pressed }) => [styles.row, pressed && { borderColor: alpha(colors.accent, 0.5) }]}>
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {r.titulo}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <StatusBadge estado={r.estadoActual} showIcon={false} />
                      <Text style={styles.rowMeta}>{formatRelativeTime(r.fechaCreacion)}</Text>
                    </View>
                  </View>
                  <Pressable hitSlop={8} onPress={() => router.push(`/reportes/${r.id}/editar`)} style={styles.iconBtn} accessibilityLabel="Editar">
                    <Feather name="edit-2" size={16} color={colors.textSecondary} />
                  </Pressable>
                  <Pressable hitSlop={8} onPress={() => confirmDelete(r.id)} style={styles.iconBtn} accessibilityLabel="Eliminar">
                    <Feather name="trash-2" size={16} color={colors.error} />
                  </Pressable>
                </Pressable>
              ))
            )}
          </View>
        )}

        {tab === 'datos' && (
          <Card style={{ gap: spacing.md }}>
            <InfoRow icon="user" text={`${user.nombre} ${user.apellido ?? ''}`} />
            <InfoRow icon="mail" text={user.email} />
            <InfoRow icon="shield" text={rolLabel} />
            {user.fechaRegistro && <InfoRow icon="calendar" text={`Miembro desde ${formatDateTime(user.fechaRegistro)}`} />}
          </Card>
        )}

        {tab === 'seguridad' && (
          <Card style={{ gap: spacing.md }}>
            <InfoRow icon="lock" text="Tu sesión se guarda cifrada en este dispositivo." />
            <Button title="Cambiar contraseña" variant="secondary" icon="key" onPress={() => Alert.alert('Cambiar contraseña', 'Cierra sesión y usa “¿Olvidaste tu contraseña?” para recibir un código por correo.')} />
          </Card>
        )}

        <Button title="Cerrar sesión" variant="danger" icon="log-out" onPress={confirmLogout} style={{ marginTop: spacing.sm }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: alpha(colors.accent, 0.35),
  },
  avatarText: { fontFamily: fonts.heading, fontSize: 24, color: colors.onAccent, letterSpacing: 1 },
  rol: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius, backgroundColor: colors.accent },
  rolText: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.onAccent },
  tabs: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: radius, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  tab: { flex: 1, paddingVertical: 10, borderRadius: radius, alignItems: 'center' },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.lg, borderRadius: radius, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  rowTitle: { fontFamily: fonts.heading, fontSize: 15, textTransform: 'uppercase', color: colors.text },
  rowMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface2 },
});
