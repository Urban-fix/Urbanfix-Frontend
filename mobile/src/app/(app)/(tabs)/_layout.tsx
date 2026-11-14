import React from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, radius } from '../../../theme/tokens';
import type { IconName } from '../../../components/ui';

const icon =
  (name: IconName) =>
  ({ color }: { color: ColorValue }) => <Feather name={name} size={21} color={color as string} />;

/** Barra inferior: reemplaza el Sidebar / MobileNavSheet del web. */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line, borderTopWidth: 1, height: 64, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 10.5, letterSpacing: 0.3, textTransform: 'uppercase' },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="informes" options={{ title: 'Informes', tabBarIcon: icon('file-text') }} />
      <Tabs.Screen
        name="crear"
        options={{
          title: 'Nuevo',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.fab, focused && { backgroundColor: colors.accentHover }]}>
              <Feather name="plus" size={24} color={colors.onAccent} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen name="mapa" options={{ title: 'Mapa', tabBarIcon: icon('map') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icon('user') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 48,
    height: 48,
    marginTop: 10,
    borderRadius: radius,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
