import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ReporteCard } from '../../../components/ReporteCard';
import { Body, Button, Card, Chip, EmptyState, ErrorBanner, Heading, Input, Select, Skeleton } from '../../../components/ui';
import { useCategorias, useReportes, useZonas } from '../../../hooks/useData';
import { ESTADOS_REPORTE, estadoLabel } from '../../../utils/constants';
import { colors, spacing } from '../../../theme/tokens';

/** Informes: lista de reportes con los mismos filtros que el web. */
export default function InformesScreen() {
  const router = useRouter();
  const [estado, setEstado] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [zonaId, setZonaId] = useState<number | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // debounce de la búsqueda para no pegarle al backend en cada tecla
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filters = useMemo(() => ({ estado, categoriaId: categoriaId || undefined, zonaId: zonaId || undefined, search }), [estado, categoriaId, zonaId, search]);
  const { data: reportes, isLoading, isRefreshing, error, refetch } = useReportes(filters);
  const { data: categorias } = useCategorias();
  const { data: zonas } = useZonas();

  const estadoFilters = [{ id: '', label: 'Todos' }, ...Object.values(ESTADOS_REPORTE).map((e) => ({ id: e, label: estadoLabel(e).toLowerCase() }))];

  const active: { key: string; label: string; clear: () => void }[] = [];
  if (categoriaId) active.push({ key: 'c', label: `Categoría: ${categorias.find((c) => c.id === categoriaId)?.nombre ?? categoriaId}`, clear: () => setCategoriaId('') });
  if (zonaId) active.push({ key: 'z', label: `Zona: ${zonas.find((z) => z.id === zonaId)?.nombre ?? zonaId}`, clear: () => setZonaId('') });
  if (search) active.push({ key: 's', label: `Buscar: ${search}`, clear: () => setSearchInput('') });

  const clearAll = () => {
    setEstado('');
    setCategoriaId('');
    setZonaId('');
    setSearchInput('');
  };

  const header = (
    <View style={{ gap: spacing.lg, marginBottom: spacing.lg }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Heading size={28}>Informes</Heading>
          <Body secondary size={14}>
            Explora todos los reportes de la comunidad
          </Body>
        </View>
        <Button title="Nuevo" icon="plus" size="sm" onPress={() => router.push('/crear')} />
      </View>

      <Card style={{ gap: spacing.md }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {estadoFilters.map((f) => (
            <Chip key={f.id || 'all'} label={f.label} active={estado === f.id} onPress={() => setEstado(f.id)} />
          ))}
        </ScrollView>
        <Input icon="search" placeholder="Título o descripción…" value={searchInput} onChangeText={setSearchInput} returnKeyType="search" />
        <Button title={showFilters ? 'Ocultar filtros' : 'Más filtros'} variant="ghost" size="sm" icon="sliders" onPress={() => setShowFilters((s) => !s)} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />
        {showFilters && (
          <View style={{ gap: spacing.md }}>
            <Select label="Categoría" placeholder="Todas las categorías" allowEmpty value={categoriaId} options={categorias.map((c) => ({ value: c.id, label: c.nombre }))} onChange={setCategoriaId} />
            <Select label="Zona" placeholder="Todas las zonas" allowEmpty value={zonaId} options={zonas.map((z) => ({ value: z.id, label: z.nombre }))} onChange={setZonaId} />
          </View>
        )}
        {active.length > 0 && (
          <View style={styles.activeRow}>
            {active.map((c) => (
              <Chip key={c.key} label={c.label} onClear={c.clear} />
            ))}
            <Button title="Limpiar todo" variant="ghost" size="sm" onPress={clearAll} />
          </View>
        )}
      </Card>

      {error && <ErrorBanner message={error} onRetry={refetch} />}
      {!isLoading && (
        <Body muted size={13}>
          {reportes.length} resultado{reportes.length !== 1 ? 's' : ''}
        </Body>
      )}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={isLoading ? [] : reportes}
        keyExtractor={(r) => String(r.id)}
        ListHeaderComponent={header}
        contentContainerStyle={{ padding: spacing.gutter, paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        renderItem={({ item }) => <ReporteCard reporte={item} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} tintColor={colors.accent} colors={[colors.accent]} progressBackgroundColor={colors.surface} />}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ gap: spacing.lg }}>
              <Skeleton height={260} />
              <Skeleton height={260} />
            </View>
          ) : (
            <EmptyState title="Sin resultados" text="No hay reportes con estos filtros." action={active.length || estado ? <Button title="Limpiar filtros" variant="secondary" onPress={clearAll} /> : undefined} />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line },
  activeRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
});
